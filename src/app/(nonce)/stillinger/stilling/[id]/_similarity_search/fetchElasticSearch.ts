"use server";

import { unstable_cache } from "next/cache";
import { LignenendeAnnonserResponseSchema } from "@/server/schemas/stillingSearchSchema";
import { type FetchResult } from "@/app/(nonce)/stillinger/(sok)/_utils/fetchTypes";
import { logZodError } from "@/app/(nonce)/stillinger/_common/actions/LogZodError";
import simplifySearchResponse, {
    type SimilaritySearchResultData,
} from "@/app/(nonce)/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";
import { fetchLocationsWithinDrivingDistance } from "@/app/(nonce)/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import elasticSimilaritySearchRequestBody, {
    type SimilarAdsSearchQuery,
} from "@/app/(nonce)/stillinger/stilling/[id]/_similarity_search/elasticSimilaritySearchRequestBody";
import { toParseError } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/error-types";

export async function fetchElasticSearch(
    query: SimilarAdsSearchQuery,
    headers: HeadersInit,
    fetchOptions = {},
    performSearchIfDrivingDistanceError = true,
) {
    const elasticSearchQuery: SimilarAdsSearchQuery = { ...query };
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

    const body = elasticSimilaritySearchRequestBody(elasticSearchQuery);
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
    query: SimilarAdsSearchQuery,
    headers: HeadersInit,
): Promise<FetchResult<SimilaritySearchResultData>> {
    const result = await fetchElasticSearch(query, headers);

    const { response } = result;

    if (!response?.ok) {
        throw new Error(`Failed to fetch data from elastic search: ${response?.status}`);
    }

    const data = await response.json();
    const parsedData = LignenendeAnnonserResponseSchema.safeParse(data);

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
