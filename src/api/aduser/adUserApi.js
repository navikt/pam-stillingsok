import SearchApiError from "../search/SearchApiError";
import { AD_USER_API, CONTEXT_PATH } from "../../environment";

const getCookie = (name) => {
    const re = new RegExp(`${name}=([^;]+)`);
    const match = re.exec(document.cookie);
    return match !== null ? match[1] : "";
};

export async function adUserApiGet(url) {
    let response;
    try {
        response = await fetch(`${AD_USER_API}/${url}`, {
            credentials: "include",
            method: "GET",
            referrer: CONTEXT_PATH
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function adUserApiPost(url, query, toJson = true) {
    let response;
    try {
        response = await fetch(`${AD_USER_API}/${url}`, {
            credentials: "include",
            body: JSON.stringify(query),
            method: "POST",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN-ARBEIDSPLASSEN": getCookie("XSRF-TOKEN-ARBEIDSPLASSEN")
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }

    return toJson ? response.json() : response;
}

export async function adUserApiPut(url, query) {
    let response;
    try {
        response = await fetch(`${AD_USER_API}/${url}`, {
            credentials: "include",
            body: JSON.stringify(query),
            method: "PUT",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN-ARBEIDSPLASSEN": getCookie("XSRF-TOKEN-ARBEIDSPLASSEN")
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function adUserApiRemove(url) {
    let response;
    try {
        response = await fetch(`${AD_USER_API}/${url}`, {
            credentials: "include",
            method: "DELETE",
            referrer: CONTEXT_PATH,
            headers: {
                "Content-Type": "application/json",
                "X-XSRF-TOKEN-ARBEIDSPLASSEN": getCookie("XSRF-TOKEN-ARBEIDSPLASSEN")
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response;
}
