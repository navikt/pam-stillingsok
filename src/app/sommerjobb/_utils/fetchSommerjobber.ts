"use server";

import sommerjobbElasticSearchRequestBody from "@/app/sommerjobb/_utils/sommerjobbElasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { unstable_cache } from "next/cache"; // eslint-disable-line
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import { fetchLocationsWithinDrivingDistance } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import {
    mapHits,
    SommerjobbSoekResponse,
    SommerjobbSoekResponseSchema,
    StillingSoekElement,
} from "@/server/schemas/stillingSearchSchema";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { DefaultQuery } from "@/app/stillinger/(sok)/_utils/query";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";

export type SommerjobbSearchResult = {
    ads: StillingSoekElement[];
    totalAds: number;
};

function simplifySommerjobbSearchResponse(response: SommerjobbSoekResponse): SommerjobbSearchResult {
    return {
        ads: response.hits.hits.map(mapHits),
        totalAds: response.hits.total.value,
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
    query: DefaultQuery,
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
                return {
                    errors: errors,
                };
            }
        }
    }
    const measureSearchDuration = elasticSearchDurationHistogram.startTimer();

    const body = sommerjobbElasticSearchRequestBody(elasticSearchQuery);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(body),
        ...fetchOptions,
    });

    measureSearchDuration();

    incrementElasticSearchRequests(res.ok);

    return {
        errors: errors,
        response: res,
    };
}

export const fetchSommerjobber = unstable_cache(
    async (query) => fetchSimplifiedElasticSearch(query),
    ["elastic-search-query"],
    {
        revalidate: 60,
    },
);

async function fetchSimplifiedElasticSearch(query: DefaultQuery): Promise<FetchResult<SommerjobbSearchResult>> {
    const result = await fetchElasticSearch(query);

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
