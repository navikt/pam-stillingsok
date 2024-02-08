import APIError from "./APIError";
import { CONTEXT_PATH } from "../environment";
import { stringifyQuery } from "../../(sok)/_utils/old_query";

let latestAdResponse;

let suggestionsCache = [];
const CACHE_MAX_SIZE = 100;

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

async function post(url, body) {
    let response;
    try {
        response = await fetch(`${CONTEXT_PATH}/${url}`, {
            body: JSON.stringify(body),
            method: "POST",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
            },
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

async function getSuggestions(query) {
    const url = "api/suggestions";
    const queryString = stringifyQuery(query);
    const cachedUrl = `${CONTEXT_PATH}/${url}${queryString}`;

    const cached = suggestionsCache.find((c) => c.cachedUrl === cachedUrl);
    if (cached) {
        return cached.response;
    }
    const response = await post(url, query);
    suggestionsCache = [{ cachedUrl, response }, ...suggestionsCache].slice(0, CACHE_MAX_SIZE);
    return response;
}

const SearchAPI = {
    get,
    getSuggestions,
    getAd,
};

export default SearchAPI;
