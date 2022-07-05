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

    const text = await response.text()
    if (response.status === 204 || text.length == 0){ // No content
        return undefined
    } else {
        return response.json();
    } 
    


}

async function getNextEvent() {
    return await get(`${JOBBTREFF_API_URL}/next`);
}

const EventAPI = {
    getNextEvent
};

export default EventAPI;
