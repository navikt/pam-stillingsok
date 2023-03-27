import { INTEREST_API_URL } from "../../../common/environment";
import APIError from "../../../common/api/APIError";
import { v4 as uuidv4 } from "uuid";

const NAV_CALLID_FIELD = "Nav-CallId";

async function get(url) {
    let response;
    try {
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            method: "GET",
            headers: { NAV_CALLID_FIELD: uuidv4() }
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
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            method: "DELETE",
            headers: {
                NAV_CALLID_FIELD: uuidv4()
            }
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
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            body: JSON.stringify(query),
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                NAV_CALLID_FIELD: uuidv4()
            }
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        let errorMsg;
        try {
            const errorJson = await response.json();
            errorMsg = errorJson.error_code || response.statusText;
        } catch (parseError) {
            errorMsg = response.statusText;
        }
        throw new APIError(errorMsg, response.status);
    }

    return toJson ? response.json() : response;
}

async function getInterestForm(adUuid) {
    return get(`interest-form/${adUuid}`);
}

async function postInterest(adUuid, interest) {
    return post(`interest-form/${adUuid}/candidates`, interest, false);
}

async function deleteInterest(adUuid, uuid) {
    return remove(`interest-form/${adUuid}/candidates/${uuid}`);
}

const InterestAPI = {
    getInterestForm: getInterestForm,
    postInterest: postInterest,
    deleteInterest: deleteInterest
};

export default InterestAPI;
