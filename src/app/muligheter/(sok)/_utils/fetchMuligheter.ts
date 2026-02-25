"use server";

import { unstable_cache } from "next/cache";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import { fetchLocationsWithinDrivingDistance } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import {
    getEmployerName,
    HitRaw,
    type MuligheterSoekResponse,
    MuligheterSoekResponseSchema,
} from "@/server/schemas/stillingSearchSchema";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import type { Location } from "@/app/stillinger/_common/lib/ad-model";
import { toParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { sanitizeHtml } from "@/server/utils/htmlSanitizer";
import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { MuligheterResultData } from "@/app/muligheter/(sok)/_utils/types/MuligheterResultData";
import { MulighetQuery } from "@/app/muligheter/(sok)/_utils/types/MulighetQuery";
import muligheterOpenSearchRequestBody from "@/app/muligheter/(sok)/_utils/muligheterOpenSearchRequestBody";
import { Mulighet } from "@/app/muligheter/(sok)/_utils/types/Mulighet";

function mapHitsToMuligheter(data: HitRaw): Mulighet {
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
    };
}

function simplifyMuligheterSearchResponse(response: MuligheterSoekResponse): MuligheterResultData {
    return {
        ads: response.hits.hits.map(mapHitsToMuligheter),
        totalAds: response.hits.total.value || 0,
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

export async function fetchInternalOpenSearch(
    query: MulighetQuery,
    headers: HeadersInit,
    fetchOptions = {},
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

    const body = muligheterOpenSearchRequestBody(elasticSearchQuery);
    const res = await fetch(`${process.env.PAM_DIR_API_URL}/rest/dir/osproxy/search`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        ...fetchOptions,
    });

    measureSearchDuration();
    incrementElasticSearchRequests(res.ok);

    return { errors, response: res };
}

export const fetchMuligheter = unstable_cache(
    async (query, headers) => {
        return fetchSimplifiedInternalOpenSearch(query, headers);
    },
    ["internal-open-search-query"],
    { revalidate: 60 },
);

async function fetchSimplifiedInternalOpenSearch(
    query: MulighetQuery,
    headers: HeadersInit,
): Promise<FetchResult<MuligheterResultData>> {
    const result = await fetchInternalOpenSearch(query, headers);

    const { response } = result;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from elastic search: ${response?.status}`);
    }

    const data = await response.json();
    const parsedData = MuligheterSoekResponseSchema.safeParse(data);

    if (!parsedData.success) {
        const parseError = toParseError(parsedData.error);
        logZodError(parseError);

        return {
            data: simplifyMuligheterSearchResponse(data),
            errors: [],
        };
    }

    return {
        data: simplifyMuligheterSearchResponse(parsedData.data),
        errors: result.errors,
    };
}
