"use server";

import elasticSearchRequestBody from "@/app/stillinger/(sok)/_utils/elasticSearchRequestBody";
import simplifySearchResponse from "@/app/stillinger/(sok)/_utils/simplifySearchResponse";
import { unstable_cache } from "next/cache";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import {
    fetchLocationsWithinDrivingDistance,
    type Locations,
} from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { StillingSoekResponseSchema } from "@/server/schemas/stillingSearchSchema";
import { type FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchQuery } from "@/app/stillinger/(sok)/_utils/query";
import { toParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";

export type ExtendedQuery = SearchQuery & {
    withinDrivingDistance?: Locations | undefined;
};

export async function fetchInternalOpenSearch(
    query: SearchQuery,
    headers: HeadersInit,
    fetchOptions = {},
    performSearchIfDrivingDistanceError = true,
) {
    const internalOpenSearchQuery: ExtendedQuery = { ...query };
    const shouldLookupLocationsWithinDrivingDistance =
        internalOpenSearchQuery.postcode && internalOpenSearchQuery.distance;
    const errors = [];

    if (shouldLookupLocationsWithinDrivingDistance) {
        const withinDrivingDistanceResult = await fetchLocationsWithinDrivingDistance(
            internalOpenSearchQuery.postcode,
            internalOpenSearchQuery.distance,
        );

        if (withinDrivingDistanceResult.data) {
            internalOpenSearchQuery.withinDrivingDistance = withinDrivingDistanceResult.data;
        }

        if (withinDrivingDistanceResult.errors) {
            errors.push(...withinDrivingDistanceResult.errors);

            if (!performSearchIfDrivingDistanceError) {
                return { errors };
            }
        }
    }

    const measureSearchDuration = elasticSearchDurationHistogram.startTimer();

    const body = elasticSearchRequestBody(internalOpenSearchQuery);

    console.log("Aiai her er ny greie");

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

export const fetchCachedSimplifiedInternalOpenSearch = unstable_cache(
    async (query, headers) => {
        return fetchSimplifiedInternalOpenSearch(query, headers);
    },
    ["internal-open-search-query"],
    { revalidate: 60 },
);

async function fetchSimplifiedInternalOpenSearch(
    query: SearchQuery,
    headers: HeadersInit,
): Promise<FetchResult<SearchResult>> {
    const result = await fetchInternalOpenSearch(query, headers);

    const { response } = result;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from internal opensearch: ${response?.status}`);
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
