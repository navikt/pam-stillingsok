import {INTEREST_API_URL} from "../environment";
import APIError from "./APIError";

async function get(url) {
    let response;
    try {
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            method: "GET"
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
        response = await fetch(`${INTEREST_API_URL}/${url}`, {
            body: JSON.stringify(query),
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            }
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new APIError(response.statusText, response.status);
    }

    return toJson ? response.json() : response;
}

async function getInterestForm(adUuid) {
    return get(`interest-form/${adUuid}`);
}

async function postInterest(adUuid, interest) {
    return post(`interest-form/${adUuid}/candidates`, interest);
}

const InterestAPI = {
    getInterestForm: getInterestForm,
    postInterest: postInterest,
};

export default InterestAPI;
