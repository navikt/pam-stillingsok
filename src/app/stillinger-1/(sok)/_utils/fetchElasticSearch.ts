"use server";

import elasticSearchRequestBody from "@/app/stillinger-1/(sok)/_utils/elasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import simplifySearchResponse from "@/app/stillinger/(sok)/_utils/simplifySearchResponse";
import { incrementElasticSearchRequests } from "@/metrics";
import { Locations } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { FetchResult } from "@/app/stillinger/(sok)/_utils/fetchTypes";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { SearchQuery } from "@/app/stillinger/(sok)/_utils/query";

export type ExtendedQuery = SearchQuery & {
    withinDrivingDistance?: Locations | undefined;
};

export async function fetchElasticSearch(query: SearchQuery, headers: HeadersInit, fetchOptions = {}) {
    const elasticSearchQuery: ExtendedQuery = { ...query };

    const body = await elasticSearchRequestBody(elasticSearchQuery);

    // console.log("BODY", body);
    console.log(JSON.stringify(body, null, 2));

    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/api/ad/_search`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
        ...fetchOptions,
    });

    incrementElasticSearchRequests(res.ok);

    return { undefined, response: res };
}

// @ts-expect-error nada
export const fetchCachedSimplifiedElasticSearch = async (query) => {
    const headers = await getDefaultHeaders();
    return fetchSimplifiedElasticSearch(query, headers);
};

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
    const parsedData = data;
    // console.log("DATA", parsedData);

    // if (!parsedData.success) {
    //     logZodError("søk", parsedData.error);

    //     return {
    //         data: simplifySearchResponse(data),
    //         errors: [],
    //     };
    // }

    return {
        data: simplifySearchResponse(parsedData),
        // @ts-expect-error nada
        errors: result.errors,
    };
}
