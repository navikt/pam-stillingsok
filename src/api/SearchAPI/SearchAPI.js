import APIError from "../APIError";
import { CONTEXT_PATH } from "../../environment";
import { stringifyQuery } from "../../modules/Search/query";
import buildAggregations from "./builders/buildAggregations";
import { buildSearchResult } from "./builders/buildSearchResult";
import buildUnknown from "./builders/buildUnknown";

let cache = [];
const CACHE_MAX_SIZE = 100;

async function get(url, query = {}) {
    const queryString = stringifyQuery(query);
    let response;
    try {
        response = await fetch(`${CONTEXT_PATH}/${url}${queryString}`, {
            method: "GET",
            referrer: CONTEXT_PATH
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new APIError(response.statusText, response.status);
    }
    return response.json();
}

async function getAndCache(url, query = {}) {
    const queryString = stringifyQuery(query);
    const cachedUrl = `${CONTEXT_PATH}/${url}${queryString}`;

    const cached = cache.find((c) => c.cachedUrl === cachedUrl);
    if (cached) {
        return cached.response;
    }
    const response = await get(url, query);
    cache = [{ cachedUrl, response }, ...cache].slice(0, CACHE_MAX_SIZE);
    return response;
}

async function search(query = {}) {
    const [globalResponse, customResponse, locationsResponse] = await Promise.all([
        get("api/search", {}), // An empty search aggregates search criteria across all ads
        get("api/search", query), // If user has some search criteria in browser url, make an extra search to get that result
        getAndCache("api/locations") // Search criteria for locations are not aggregated, but based on a predefined list
    ]);
    const globalResult = buildSearchResult(globalResponse);
    const customResult = buildSearchResult(customResponse);
    const aggregations = buildAggregations(globalResult, customResult, locationsResponse);
    const unknown = buildUnknown(query, aggregations, globalResult, locationsResponse);

    return {
        ...customResult,
        aggregations,
        locations: locationsResponse,
        unknown
    };
}

const SearchAPI = {
    get,
    search
};

export default SearchAPI;
