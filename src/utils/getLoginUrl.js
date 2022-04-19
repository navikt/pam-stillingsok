import { CONTEXT_PATH, LOGIN_URL, STILLINGSOK_URL } from "../environment";
import LocationSearchParser from "./LocationSearchParser";
import { stringifyQueryObject } from "./utils";

const allowedRedirectUrls = [
    `${CONTEXT_PATH}/intern`,
    `${CONTEXT_PATH}/stilling`,
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    CONTEXT_PATH
];

function getLoginUrl(path) {
    let redirectUrlAfterSuccessfulLogin;

    if (path.includes("/rapporter-annonse")) {
        // Send bruker tilbake til stillingen de vil rapportere etter logg inn
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/stilling${stringifyQueryObject({
            uuid: window.location.search.split("=")[1]
        })}`;
    } else if (path.startsWith(`${CONTEXT_PATH}/stilling/`)) {
        // 'stilling/:uuid' er ikke en allowedRedirectUrls url, så vi må mappe om til /stilling?uuid=<uuid>
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/stilling${stringifyQueryObject({
            uuid: path.split(`${CONTEXT_PATH}/stilling/`)[1]
        })}`;
    } else if (path.startsWith(`${CONTEXT_PATH}/intern/`)) {
        // 'intern/:uuid' er ikke en allowedRedirectUrls url, så vi må mappe om til /intern?uuid=<uuid>
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/intern${stringifyQueryObject({
            uuid: path.split(`${CONTEXT_PATH}/intern/`)[1]
        })}`;
    } else if (path.startsWith(`${CONTEXT_PATH}/lagrede-sok`)) {
        const query = {};
        const uuid = LocationSearchParser.extractParam("uuid");
        if (uuid !== null) query["uuid"] = uuid;
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/lagrede-sok${stringifyQueryObject(query)}`;
    } else if (path === CONTEXT_PATH) {
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}${window.location.search}`;
    } else if (allowedRedirectUrls.includes(path)) {
        redirectUrlAfterSuccessfulLogin = `${STILLINGSOK_URL}/${path.split(`${CONTEXT_PATH}/`)[1]}`;
    } else {
        redirectUrlAfterSuccessfulLogin = STILLINGSOK_URL;
    }
    return `${LOGIN_URL}?level=Level3&redirect=${encodeURIComponent(redirectUrlAfterSuccessfulLogin)}`;
}

export default getLoginUrl;
