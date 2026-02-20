import * as Sentry from "@sentry/nextjs";
import { thirdPartyErrorFilterIntegration } from "@sentry/browser";
import { configureLogger } from "@navikt/next-logger";

// Check if running in browser
if (typeof window !== "undefined") {
    try {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            allowUrls: ["arbeidsplassen.nav.no", "arbeidsplassen.intern.dev.nav.no"],
            tracesSampleRate: 0.1,
            debug: false,
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

/** The instrumentation-client.ts file allows you to add monitoring,
 * analytics code, and other side-effects that run before your application becomes interactive
 * https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation-client
 */
configureLogger({
    basePath: process.env.NEXT_PUBLIC_CONTEXT_PATH ?? undefined,
});

const startTime = performance.now();

const observer = new PerformanceObserver((list: PerformanceObserverEntryList) => {
    for (const entry of list.getEntries()) {
        if (entry instanceof PerformanceNavigationTiming) {
            console.log("Time to Interactive:", entry.loadEventEnd - startTime);
        }
    }
});

observer.observe({ entryTypes: ["navigation"] });

export function onRouterTransitionStart(url: string) {
    performance.mark(`nav-start-${url}`);
}

//export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
