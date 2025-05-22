// src/instrumentation-client.ts
import * as Sentry from "@sentry/nextjs";

console.log("process.env.NEXT_PUBLIC_SENTRY_DSN", process.env.NEXT_PUBLIC_SENTRY_DSN);
console.log("process.env.SENTRY_RELEASE", process.env.NEXT_PUBLIC_SENTRY_RELEASE);
// Check if running in browser
if (typeof window !== "undefined") {
    try {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            allowUrls: ["arbeidsplassen.nav.no", "arbeidsplassen.intern.dev.nav.no"],
            tracesSampleRate: 0.1,
            debug: true,
            release: process.env.NEXT_PUBLIC_SENTRY_RELEASE,
            // integrations: [
            //     thirdPartyErrorFilterIntegration({
            //         filterKeys: ["pam-stillingsok-app"],
            //         behaviour: "drop-error-if-contains-third-party-frames",
            //     }),
            // ],
        });
        console.log("Sentry initialized successfully");
    } catch (error) {
        console.error("Sentry initialization failed:", error);
    }
}
