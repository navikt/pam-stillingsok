import { STILLINGSOK_URL, CONTEXT_PATH } from './fasitProperties';

const whiteList = [
    //`${CONTEXT_PATH}/stilling`, // TODO: Må whitelistes
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    `${CONTEXT_PATH}/innstillinger`, // TODO: Denne kan slettes når /stillinger er whitelisted
    CONTEXT_PATH
];

export function getRedirect() {
    const path = window.location.pathname;
    const query = encodeURIComponent(window.location.search);
    const baseUrl = window.location.origin;
    if (path.startsWith(`${CONTEXT_PATH}/stilling/`)) {
        const uuid = path.split(`${CONTEXT_PATH}/stilling/`)[1];
        return `${baseUrl}${CONTEXT_PATH}/innstillinger?uuid=${uuid}`; // TODO: Endre til stillinger
    } else
    if (whiteList.includes(path)) {
        return `${baseUrl}${path}${query}`;
    }
    return STILLINGSOK_URL;
}
