import { v4 as uuidv4 } from "uuid";
import { INTEREST_API_URL } from "../../../common/environment";
import APIError from "../../../common/api/APIError";

async function get(url) {
    let response;
    try {
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            method: "GET",
            headers: { NAV_CALLID_FIELD: uuidv4() },
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new APIError(response.statusText, response.status);
    }
    return response.json();
}

async function head(url) {
    let response;
    try {
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            method: "HEAD",
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }
    if (response.status !== 204) {
        throw new APIError(response.statusText, response.status);
    }
    return response.text();
}

async function remove(url) {
    let response;
    try {
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            method: "DELETE",
            headers: {
                NAV_CALLID_FIELD: uuidv4(),
            },
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }
    if (response.status !== 200 && response.status !== 204) {
        throw new APIError(response.statusText, response.status);
    }
    return response;
}

async function post(url, query, toJson = true) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                NAV_CALLID_FIELD: uuidv4(),
            },
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        let errorMsg;
        try {
            const errorJson = await response.json();
            errorMsg = errorJson.error_code || "unknown";
        } catch (parseError) {
            errorMsg = "unknown";
        }
        throw new APIError(errorMsg, response.status);
    }

    return toJson ? response.json() : response;
}

async function getApplicationForm(adUuid) {
    return get(`application-form/${adUuid}`);
}

async function getApplicationStatus(adUuid, uuid) {
    return head(`application-form/${adUuid}/application/${uuid}`);
}

async function postApplication(adUuid, application) {
    return post(`${INTEREST_API_URL}/application-form/${adUuid}/application`, application, false);
}

async function withdrawApplication(adUuid, uuid) {
    return remove(`application-form/${adUuid}/application/${uuid}`);
}

const SuperraskSoknadAPI = {
    getApplicationForm,
    getApplicationStatus,
    postApplication,
    withdrawApplication,
    post,
};

export default SuperraskSoknadAPI;
