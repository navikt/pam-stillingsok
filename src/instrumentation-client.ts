import * as Sentry from "@sentry/nextjs";

export function register() {
    Sentry.init({
        dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
        allowUrls: ["arbeidsplassen.nav.no", "arbeidsplassen.intern.dev.nav.no"],
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

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
