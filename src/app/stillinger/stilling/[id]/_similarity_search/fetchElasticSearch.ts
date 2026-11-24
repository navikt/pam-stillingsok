"use server";

import { logZodError } from "@/app/stillinger/_common/actions/LogZodError";
import { toParseError } from "@/app/stillinger/_common/lib/ad-model/core/error-types";
import { fetchLocationsWithinDrivingDistance } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import type { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { postToSearchApi } from "@/app/stillinger/(sok)/_utils/searchApi";
import elasticSimilaritySearchRequestBody, {
    type SimilarAdsSearchQuery,
} from "@/app/stillinger/stilling/[id]/_similarity_search/elasticSimilaritySearchRequestBody";
import simplifySearchResponse, {
    type SimilaritySearchResultData,
} from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import { LignenendeAnnonserResponseSchema } from "@/server/schemas/stillingSearchSchema";

export async function fetchElasticSearch(
    query: SimilarAdsSearchQuery,
    fetchOptions: RequestInit = {},
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

    const res = await postToSearchApi(elasticSimilaritySearchRequestBody(elasticSearchQuery), fetchOptions);

    measureSearchDuration();
    incrementElasticSearchRequests(res.ok);

    return { errors, response: res };
}

export async function fetchSimplifiedElasticSearch(
    query: SimilarAdsSearchQuery,
): Promise<FetchResult<SimilaritySearchResultData>> {
    const result = await fetchElasticSearch(query);

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
