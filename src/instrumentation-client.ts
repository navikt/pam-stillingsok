import * as Sentry from "@sentry/nextjs";
import { thirdPartyErrorFilterIntegration } from "@sentry/browser";

// Check if running in browser
if (typeof window !== "undefined") {
    try {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            allowUrls: ["arbeidsplassen.nav.no", "arbeidsplassen.intern.dev.nav.no"],
            tracesSampleRate: 0.1,
            debug: true,
            release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
            integrations: [
                thirdPartyErrorFilterIntegration({
                    filterKeys: ["pam-stillingsok-app"],
                    behaviour: "apply-tag-if-contains-third-party-frames",
                }),
            ],
        });
    } catch (error) {
        console.error("Sentry initialization failed:", error);
    }
}
