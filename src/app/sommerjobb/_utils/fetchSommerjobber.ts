"use server";

import sommerjobbElasticSearchRequestBody from "@/app/sommerjobb/_utils/sommerjobbElasticSearchRequestBody";
import type { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import type { SommerjobbQuery } from "@/app/sommerjobb/_utils/types/SommerjobbQuery";
import type { SommerjobbResultData } from "@/app/sommerjobb/_utils/types/SommerjobbResultData";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import type { Location } from "@/app/stillinger/_common/lib/ad-model";
import { toParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { fetchLocationsWithinDrivingDistance } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import type { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { postToSearchApi } from "@/app/stillinger/(sok)/_utils/searchApi";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import {
    getEmployerName,
    type HitRaw,
    type SommerjobbSoekResponse,
    SommerjobbSoekResponseSchema,
} from "@/server/schemas/stillingSearchSchema";
import { sanitizeHtml } from "@/server/utils/htmlSanitizer";

function mapHitsSommerjobb(data: HitRaw): SommerjobbAd {
    // TODO: fiks type casting her når vi får kontroll på typene
    return {
        uuid: data._source.uuid,
        title: data._source.title,
        description: sanitizeHtml(data._source.properties?.adtext || "").toString(),
        employer: {
            name: getEmployerName(data) || "",
        },
        location: getWorkLocation(data._source.locationList as Location[]),
        applicationDue: data._source.properties?.applicationdue || "",
        explanation: data._explanation,
        searchtagsai: data._source.properties?.searchtagsai,
        generatedSearchMetadata: {
            summerJobMetadata: {
                isSummerJob: data._source.generatedSearchMetadata?.summerJobMetadata?.isSummerJob,
                summerJobReason: data._source.generatedSearchMetadata?.summerJobMetadata?.reason,
            },
            isUnder18: data._source.generatedSearchMetadata?.isUnder18,
            isUnder18Reason: data._source.generatedSearchMetadata?.isUnder18Reason,
            shortSummary: data._source.generatedSearchMetadata?.shortSummary,
        },
        hasSuperraskSoknad:
            data._source.properties?.hasInterestform != null && data._source.properties?.hasInterestform === "true",
    };
}

function simplifySommerjobbSearchResponse(response: SommerjobbSoekResponse): SommerjobbResultData {
    return {
        ads: response.hits.hits.map(mapHitsSommerjobb),
        totalAds: response.hits.total.value || 0,
        totalStillinger: response.aggregations?.positioncount.sum.value || 0,
    };
}

/*
Manually cached because Next.js won't cache it. We break these:
    * The fetch request comes after the usage of headers or cookies.
    * The fetch request uses Authorization or Cookie headers and there's an uncached request above it in the component tree.
    https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching

We can't use the built-in 'cache' in React either, since the route segment is dynamic:
    "... If the segment is dynamic, the output of the request will not be cached and will be re-fetched on every request when the segment is rendered."
    https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-third-party-libraries
 */

export async function fetchElasticSearch(
    query: SommerjobbQuery,
    fetchOptions: RequestInit = {},
    performSearchIfDrivingDistanceError = true,
) {
    const elasticSearchQuery: ExtendedQuery = { ...query };
    const shouldLookupLocationsWithinDrivingDistance = elasticSearchQuery.postcode && elasticSearchQuery.distance;
    const errors = [];

    if (shouldLookupLocationsWithinDrivingDistance) {
        const withinDrivingDistanceResult = await fetchLocationsWithinDrivingDistance(
            elasticSearchQuery.postcode,
            elasticSearchQuery.distance,
        );

        if (withinDrivingDistanceResult.data) {
            elasticSearchQuery.withinDrivingDistance = withinDrivingDistanceResult.data;
        }

        if (withinDrivingDistanceResult.errors) {
            errors.push(...withinDrivingDistanceResult.errors);

            if (!performSearchIfDrivingDistanceError) {
                return { errors };
            }
        }
    }

    const measureSearchDuration = elasticSearchDurationHistogram.startTimer();

    const res = await postToSearchApi(sommerjobbElasticSearchRequestBody(elasticSearchQuery), fetchOptions);

    measureSearchDuration();
    incrementElasticSearchRequests(res.ok);

    return { errors, response: res };
}

export async function fetchSommerjobber(query: SommerjobbQuery): Promise<FetchResult<SommerjobbResultData>> {
    return fetchSimplifiedElasticSearch(query);
}

async function fetchSimplifiedElasticSearch(query: SommerjobbQuery): Promise<FetchResult<SommerjobbResultData>> {
    const result = await fetchElasticSearch(query);

    const { response } = result;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from elastic search: ${response?.status}`);
    }

    const data = await response.json();
    const parsedData = SommerjobbSoekResponseSchema.safeParse(data);

    if (!parsedData.success) {
        const parseError = toParseError(parsedData.error);
        logZodError(parseError);

        return {
            data: simplifySommerjobbSearchResponse(data),
            errors: [],
        };
    }

    return {
        data: simplifySommerjobbSearchResponse(parsedData.data),
        errors: result.errors,
    };
}
