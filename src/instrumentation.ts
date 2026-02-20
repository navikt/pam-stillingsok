import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";

export function register(): void {
    console.time("[instrumentation] register total");

    console.time("[instrumentation] registerOTel");
    registerOTel({ serviceName: "pam-stillingsok" });
    console.timeEnd("[instrumentation] registerOTel");

    if (process.env.NEXT_RUNTIME === "nodejs") {
        console.time("[instrumentation] require(pino)");
        require("pino");
        console.timeEnd("[instrumentation] require(pino)");

        console.time("[instrumentation] require(next-logger)");
        require("next-logger"); // full console-patching
        console.timeEnd("[instrumentation] require(next-logger)");

        console.time("[instrumentation] Sentry.init(node)");
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
            beforeSend: (event) => {
                event.tags = { ...event.tags };
                return event;
            },
        });
        console.timeEnd("[instrumentation] Sentry.init(node)");
    } else if (process.env.NEXT_RUNTIME === "edge") {
        console.time("[instrumentation] Sentry.init(edge)");
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
        });
        console.timeEnd("[instrumentation] Sentry.init(edge)");
    }

    console.timeEnd("[instrumentation] register total");
}

export const onRequestError = Sentry.captureRequestError;
