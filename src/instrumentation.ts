import * as Sentry from "@sentry/nextjs";
import { getCallId } from "./app/stillinger/_common/monitoring/callId";

export function register() {
    // Server-side Sentry initialization
    if (process.env.NEXT_RUNTIME === "nodejs") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
            beforeSend: async (event) => {
                event.tags = { ...event.tags, navCallId: await getCallId() };
                return event;
            },
            integrations: [
                Sentry.thirdPartyErrorFilterIntegration({
                    filterKeys: ["pam-stillingsok-app"],
                    behaviour: "drop-error-if-contains-third-party-frames",
                }),
            ],
        });
    }

    // Edge runtime Sentry initialization
    if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
            integrations: [
                Sentry.thirdPartyErrorFilterIntegration({
                    filterKeys: ["pam-stillingsok-app"],
                    behaviour: "drop-error-if-contains-third-party-frames",
                }),
            ],
        });
    }
}
