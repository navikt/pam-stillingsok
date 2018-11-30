import { STILLINGSOK_URL } from './fasitProperties';

const whiteList = [
    '/pam-stillingsok/favoritter',
    '/pam-stillingsok/lagrede-sok',
    '/pam-stillingsok/innstillinger',
    '/pam-stillingsok/',
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
