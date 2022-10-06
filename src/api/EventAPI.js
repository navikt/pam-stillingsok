import { CONTEXT_PATH, JOBBTREFF_API_URL } from "../environment";
import APIError from "./APIError";

async function get(url) {
    let response;
    try {
        response = await fetch(url, {
            method: "GET",
            referrer: CONTEXT_PATH
        });
    } catch (e) {
        throw new APIError(e.message, 0);
    }

    if (response.status < 200 || response.status > 299) {
        throw new APIError(response.statusText, response.status);
    }

    try {
        return response.json();
    } catch (e) {
        throw new APIError(e.message, response.status);
    }
}

async function getNextEvent() {
    return await get(`${JOBBTREFF_API_URL}/next`);
}

const EventAPI = {
    getNextEvent
};

export default EventAPI;
