import { STILLINGSOK_URL, CONTEXT_PATH } from './fasitProperties';

const whiteList = [
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    `${CONTEXT_PATH}/innstillinger`
];

export function getRedirect() {
    const path = window.location.pathname;
    const query = encodeURIComponent(window.location.search);
    const baseUrl = window.location.origin;
    if (whiteList.includes(path)) {
        return `${baseUrl}${path}${query}`;
    }
    return STILLINGSOK_URL;
}
