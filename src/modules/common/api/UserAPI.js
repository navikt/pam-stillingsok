import APIError from "./APIError";
import { CONTEXT_PATH } from "../environment";
import getCookie from "../utils/getCookie";

async function get(url) {
    let response;
    try {
        response = await fetch(`/stillinger/${url}`, {
            credentials: "include",
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

async function post(url, query, toJson = true) {
    let response;
    try {
        response = await fetch(`/stillinger/${url}`, {
            credentials: "include",
            body: JSON.stringify(query),
            method: "POST",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN-ARBEIDSPLASSEN": getCookie("XSRF-TOKEN-ARBEIDSPLASSEN"),
            },
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new APIError(response.statusText, response.status);
    }

    return toJson ? response.json() : response;
}

async function postWithoutCredentials(url, query, toJson = true) {
    let response;
    try {
        response = await fetch(`/stillinger/${url}`, {
            body: JSON.stringify(query),
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

    return toJson ? response.json() : response;
}

async function put(url, query) {
    let response;
    try {
        response = await fetch(`/stillinger/${url}`, {
            credentials: "include",
            body: JSON.stringify(query),
            method: "PUT",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN-ARBEIDSPLASSEN": getCookie("XSRF-TOKEN-ARBEIDSPLASSEN"),
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

async function remove(url) {
    let response;
    try {
        response = await fetch(`/stillinger/${url}`, {
            // credentials: "include",
            method: "DELETE",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN-ARBEIDSPLASSEN": getCookie("XSRF-TOKEN-ARBEIDSPLASSEN"),
            },
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new APIError(response.statusText, response.status);
    }
    return response;
}

const UserAPI = {
    get,
    post,
    postWithoutCredentials,
    put,
    remove,
};

export default UserAPI;
