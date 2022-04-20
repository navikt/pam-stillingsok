import * as Sentry from "@sentry/browser";

export default function initSentry() {
    Sentry.init({
        dsn: "https://76170ea4b79246638c1d9eb1c0e4fca9@sentry.gc.nav.no/37",
        blacklistUrls: [new RegExp("localhost"), new RegExp("arbeidsplassen-q.nav.no")]
    });
}
