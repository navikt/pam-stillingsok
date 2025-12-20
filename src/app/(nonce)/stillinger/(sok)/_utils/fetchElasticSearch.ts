"use server";

import elasticSearchRequestBody from "@/app/(nonce)/stillinger/(sok)/_utils/elasticSearchRequestBody";
import simplifySearchResponse from "@/app/(nonce)/stillinger/(sok)/_utils/simplifySearchResponse";
import { unstable_cache } from "next/cache";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import {
    fetchLocationsWithinDrivingDistance,
    type Locations,
} from "@/app/(nonce)/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { StillingSoekResponseSchema } from "@/server/schemas/stillingSearchSchema";
import { type FetchResult } from "@/app/(nonce)/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/(nonce)/stillinger/_common/types/SearchResult";
import { type SearchQuery } from "@/app/(nonce)/stillinger/(sok)/_utils/query";
import { toParseError } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/error-types";
import { logZodError } from "@/app/(nonce)/stillinger/_common/actions/LogZodError";

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
    async (query, headers) => {
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
        const parseError = toParseError(parsedData.error);

        logZodError(parseError);
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
