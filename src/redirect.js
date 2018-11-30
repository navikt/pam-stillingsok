import { STILLINGSOK_URL, CONTEXT_PATH } from './fasitProperties';

const whiteList = [
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    `${CONTEXT_PATH}/innstillinger`,
    `${CONTEXT_PATH}`,
    '/'
];

export function getRedirect() {
    const path = window.location.pathname;
    const query = encodeURIComponent(window.location.search);

    if (whiteList.includes(path)) {
        return `${STILLINGSOK_URL}${path}${query}`;
    }

    return STILLINGSOK_URL;
}
