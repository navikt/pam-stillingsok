"use server";

import { unstable_cache } from "next/cache";
import elasticSearchRequestBody from "@/app/stillinger/(sok)/_utils/elasticSearchRequestBody";
import simplifySearchResponse from "@/app/stillinger/(sok)/_utils/simplifySearchResponse";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import {
    fetchLocationsWithinDrivingDistance,
    type Locations,
} from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { StillingSoekResponseSchema } from "@/server/schemas/stillingSearchSchema";
import { type FetchError, type FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { type SearchQuery } from "@/app/stillinger/(sok)/_utils/query";
import { toParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

export type ExtendedQuery = SearchQuery & {
    withinDrivingDistance?: Locations | undefined;
    readonly municipal?: string | undefined;
    readonly county?: string | undefined;
};

const GLOBAL_AGGREGATIONS_REVALIDATE_SECONDS = 60;

export async function fetchElasticSearch(
    query: SearchQuery,
    fetchOptions: RequestInit = {},
    performSearchIfDrivingDistanceError = true,
): Promise<{
    readonly errors: readonly FetchError[];
    readonly response?: Response;
}> {
    const elasticSearchQuery: ExtendedQuery = { ...query };
    const shouldLookupLocationsWithinDrivingDistance =
        Boolean(elasticSearchQuery.postcode) && Boolean(elasticSearchQuery.distance);

    const errors: FetchError[] = [];

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

    const headers = await getDefaultHeaders();
    const measureSearchDuration = elasticSearchDurationHistogram.startTimer();

    const body = elasticSearchRequestBody(elasticSearchQuery);
    const response = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/_search`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        ...fetchOptions,
    });

    measureSearchDuration();
    incrementElasticSearchRequests(response.ok);

    return {
        errors,
        response,
    };
}

async function fetchSimplifiedElasticSearch(query: SearchQuery): Promise<FetchResult<SearchResult>> {
    const result = await fetchElasticSearch(query);
    const response = result.response;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from elastic search: ${response?.status}`);
    }

    // TODO: måtte fjerne unknown typen
    const data = await response.json();
    const parsedData = StillingSoekResponseSchema.safeParse(data);

    if (!parsedData.success) {
        const parseError = toParseError(parsedData.error);
        logZodError(parseError);

        return {
            data: simplifySearchResponse(data),
            errors: [...result.errors],
        };
    }

    return {
        data: simplifySearchResponse(parsedData.data),
        errors: [...result.errors],
    };
}

export const fetchCachedGlobalAggregations = unstable_cache(
    async () => {
        const query: SearchQuery = {
            size: 0,
        };

        return fetchSimplifiedElasticSearch(query);
    },
    ["elastic-search-global-aggregations"],
    {
        revalidate: GLOBAL_AGGREGATIONS_REVALIDATE_SECONDS,
        tags: ["elastic-search-global-aggregations"],
    },
);

export async function fetchSearchResults(query: SearchQuery) {
    return fetchSimplifiedElasticSearch(query);
}
