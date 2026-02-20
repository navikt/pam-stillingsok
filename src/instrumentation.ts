import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";

export function register(): void {
    registerOTel({ serviceName: "pam-stillingsok" });

    if (process.env.NEXT_RUNTIME === "nodejs") {
        require("pino");

        require("next-logger"); // full console-patching

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
    } else if (process.env.NEXT_RUNTIME === "edge") {
        Sentry.init({
            dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
            tracesSampleRate: 0.1,
            debug: false,
            release: process.env.SENTRY_RELEASE,
        });
    }
}

export const onRequestError = Sentry.captureRequestError;
