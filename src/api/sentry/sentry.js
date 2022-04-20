import * as Sentry from "@sentry/browser";

const blockedStatusCodes = [0, 401, 404]

export default function initSentry() {
    Sentry.init({
        dsn: "https://76170ea4b79246638c1d9eb1c0e4fca9@sentry.gc.nav.no/37",
        blacklistUrls: [new RegExp("localhost"), new RegExp("arbeidsplassen-q.nav.no")],
        beforeSend(event, hint) {
            const error = hint.originalException;
            if (error && error.statusCode !== undefined && blockedStatusCodes.includes(error.statusCode)) {
                return null; // event will be discarded
            } else {
                return event;
            }
        }
    });
}
