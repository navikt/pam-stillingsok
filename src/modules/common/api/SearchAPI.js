import APIError from "./APIError";
import { CONTEXT_PATH } from "../environment";
import simplifySearchResponse from "./SearchAPIUtils";
import { stringifyQuery } from "../../sok/query";

let latestSearchResponse;
let latestInitialResponse;
let latestLocationsResponse;
let latestAdResponse;

async function get(url, query = {}) {
    const queryString = stringifyQuery(query);
    let response;
    try {
        response = await fetch(`${CONTEXT_PATH}/${url}${queryString}`, {
            method: "GET",
            referrer: CONTEXT_PATH,
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new APIError(response.statusText, response.status);
    }
    return response.json();
}

async function getAd(id) {
    const url = `api/stilling/${id}`;
    const cachedUrl = `${CONTEXT_PATH}/${url}`;

    if (latestAdResponse && latestAdResponse.cachedUrl === cachedUrl) {
        return latestAdResponse.response;
    }
    const response = await get(url);
    latestAdResponse = { cachedUrl, response };
    return latestAdResponse.response;
}

async function getLocations() {
    if (latestLocationsResponse) {
        return latestLocationsResponse;
    }
    const response = await get("api/locations");
    latestLocationsResponse = response;
    return latestLocationsResponse;
}

async function initialSearch(query) {
    if (latestInitialResponse) {
        return latestInitialResponse;
    }
    const response = await get("api/search", query);
    latestInitialResponse = simplifySearchResponse(response);
    return latestInitialResponse;
}

async function search(query) {
    const url = "api/search";
    const queryString = stringifyQuery(query);
    const cachedUrl = `${CONTEXT_PATH}/${url}${queryString}`;

    if (latestSearchResponse && latestSearchResponse.cachedUrl === cachedUrl) {
        return latestSearchResponse.response;
    }
    const response = await get(url, query);
    latestSearchResponse = { cachedUrl, response: simplifySearchResponse(response) };
    return latestSearchResponse.response;
}

const SearchAPI = {
    get,
    getAd,
    getLocations,
    search,
    initialSearch,
};

export default SearchAPI;