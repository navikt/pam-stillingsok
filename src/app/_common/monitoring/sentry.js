import * as Sentry from "@sentry/browser";
import getSessionId from "./session";

const ignoreStatusCodes = [0, 401, 404, 502, 504];

// TypeErrors can for example occur when user
// navigates away from app while a fetch call is still running
const ignoreTypeErrors = [
    "TypeError: Failed to fetch",
    "TypeError: Load failed",
    "TypeError: NetworkError when attempting to fetch resource.",
    "TypeError: cancelled",
    "TypeError: avbrutt",
    "TypeError: cancelado",
    "TypeError: anulowane",
    "TypeError: avbruten",
    "TypeError: anulat",
];

export default function initSentry() {
    if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            allowUrls: ["arbeidsplassen.nav.no", "arbeidsplassen.intern.dev.nav.no"],
            ignoreErrors: [...ignoreTypeErrors],
            autoSessionTracking: true,
            initialScope: {
                tags: { sessionId: getSessionId() },
                user: { id: getSessionId() },
            },
            beforeSend(event, hint) {
                const error = hint.originalException;
                if (error && error.statusCode !== undefined && ignoreStatusCodes.includes(error.statusCode)) {
                    return null; // event will be discarded
                }
                return event;
            },
        });
    }
}
