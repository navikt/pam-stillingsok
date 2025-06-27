"use server";

import elasticSearchRequestBody from "@/app/stillinger-3/(sok)/_utils/elasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import simplifySearchResponse from "@/app/stillinger/(sok)/_utils/simplifySearchResponse";
import { unstable_cache } from "next/cache"; // eslint-disable-line
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import {
    fetchLocationsWithinDrivingDistance,
    Locations,
} from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { StillingSoekResponseSchema } from "@/server/schemas/stillingSearchSchema";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { SearchQuery } from "@/app/stillinger/(sok)/_utils/query";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";

export type ExtendedQuery = SearchQuery & {
    withinDrivingDistance?: Locations | undefined;
};

export async function fetchElasticSearch(
    query: SearchQuery,
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

    const body = elasticSearchRequestBody(elasticSearchQuery);
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

export const fetchCachedSimplifiedElasticSearch = unstable_cache(
    async (query) => {
        const headers = await getDefaultHeaders();
        return fetchSimplifiedElasticSearch(query, headers);
    },
    ["elastic-search-query"],
    { revalidate: 60 },
);

async function fetchSimplifiedElasticSearch(
    query: SearchQuery,
    headers: HeadersInit,
): Promise<FetchResult<SearchResult>> {
    const result = await fetchElasticSearch(query, headers);

    const { response } = result;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from elastic search: ${response?.status}`);
    }

    const data = await response.json();
    const parsedData = StillingSoekResponseSchema.safeParse(data);

    if (!parsedData.success) {
        logZodError("søk", parsedData.error);

        return {
            data: simplifySearchResponse(data),
            errors: [],
        };
    }

    return {
        data: simplifySearchResponse(parsedData.data),
        errors: result.errors,
    };
}
