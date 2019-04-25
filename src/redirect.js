import { STILLINGSOK_URL, CONTEXT_PATH } from './fasitProperties';

const whiteList = [
    //`${CONTEXT_PATH}/stilling`,
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    `${CONTEXT_PATH}/innstillinger`,
    CONTEXT_PATH
];

export function getRedirect() {
    const path = window.location.pathname;
    const query = encodeURIComponent(window.location.search);
    const baseUrl = window.location.origin;
    // if (path.startsWith(`${CONTEXT_PATH}/stilling/`)) {
    //     const uuid = path.split(`${CONTEXT_PATH}/stilling/`)[1];
    //     return `${baseUrl}${CONTEXT_PATH}/stilling?uuid=${uuid}`;
    // } else
    if (whiteList.includes(path)) {
        return `${baseUrl}${path}${query}`;
    }
    return STILLINGSOK_URL;
}
