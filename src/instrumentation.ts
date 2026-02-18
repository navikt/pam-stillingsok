import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";

export async function register(): Promise<void> {
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
    if (process.env.NEXT_RUNTIME === "nodejs") {
        /**
         * This forces next.js's module tracing output (standalone) to include these libraries, because they are
         * otherwise never seen by the module tracer.
         */
        await require("pino");
        await require("pino-socket");
        /**
         * next-logger (not to be confused with @navikt/next-logger) monkey-patches console log and the Next.js logger
         * and needs to be initialized as early as possible. We use next's instrumentation hooks for this.
         */
        await require("next-logger");
    }
}

export const onRequestError = Sentry.captureRequestError;
