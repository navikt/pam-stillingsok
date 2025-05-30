"use server";

import sommerjobbElasticSearchRequestBody from "@/app/sommerjobb/_utils/sommerjobbElasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { unstable_cache } from "next/cache"; // eslint-disable-line
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import { fetchLocationsWithinDrivingDistance } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import {
    getEmployerName,
    HitRaw,
    SommerjobbSoekResponse,
    SommerjobbSoekResponseSchema,
} from "@/server/schemas/stillingSearchSchema";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import DOMPurify from "isomorphic-dompurify";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { SommerjobbResultData } from "@/app/sommerjobb/_utils/types/SommerjobbResultData";
import { SommerjobbQuery } from "@/app/sommerjobb/_utils/types/SommerjobbQuery";

function mapHitsSommerjobb(data: HitRaw): SommerjobbAd {
    return {
        uuid: data._source.uuid,
        title: data._source.title,
        description: DOMPurify.sanitize(data._source.properties?.adtext || "").toString(),
        employer: {
            name: getEmployerName(data) || "",
        },
        location: getWorkLocation(undefined, data._source.locationList),
        applicationDue: data._source.properties?.applicationdue || "",
        explanation: data._explanation,
        searchtagsai: data._source.properties?.searchtagsai,
    };
}

function simplifySommerjobbSearchResponse(response: SommerjobbSoekResponse): SommerjobbResultData {
    return {
        ads: response.hits.hits.map(mapHitsSommerjobb),
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
export async function fetchElasticSearch(
    query: SommerjobbQuery,
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

    const body = sommerjobbElasticSearchRequestBody(elasticSearchQuery);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/_search`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        ...fetchOptions,
    });

    measureSearchDuration();
    incrementElasticSearchRequests(res.ok);

    return { errors, response: res };
}

export const fetchSommerjobber = unstable_cache(
    async (query) => {
        const headers = await getDefaultHeaders();
        return fetchSimplifiedElasticSearch(query, headers);
    },
    ["elastic-search-query"],
    { revalidate: 60 },
);

async function fetchSimplifiedElasticSearch(
    query: SommerjobbQuery,
    headers: HeadersInit,
): Promise<FetchResult<SommerjobbResultData>> {
    const result = await fetchElasticSearch(query, headers);

    const { response } = result;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from elastic search: ${response?.status}`);
    }

    const data = await response.json();
    const parsedData = SommerjobbSoekResponseSchema.safeParse(data);

    if (!parsedData.success) {
        logZodError("søk", parsedData.error);

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
