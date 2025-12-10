import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";

export function register() {
    registerOTel({ serviceName: "pam-stillingsok" });

    // Server-side Sentry initialization
    if (process.env.NEXT_RUNTIME === "nodejs") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
            beforeSend: async (event) => {
                event.tags = { ...event.tags };
                return event;
            },
        });
    }

    // Edge runtime Sentry initialization
    if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
        });
    }
}

export const onRequestError = Sentry.captureRequestError;
