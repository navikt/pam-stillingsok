import APIError from "./APIError";
import { CONTEXT_PATH } from "../environment";
import { simplifySearchResponse } from "./SearchAPIUtils";
import { stringifyQuery } from "../../modules/search/query";

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
    const response = await get("api/search", query);
    return simplifySearchResponse(response);
}

const SearchAPI = {
    get,
    getAndCache,
    search
};

export default SearchAPI;
