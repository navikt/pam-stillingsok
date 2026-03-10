import * as Sentry from "@sentry/nextjs";
import { registerOTel } from "@vercel/otel";

export async function register(): Promise<void> {
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

        const { startRuntimeMetrics } = await import("@/server/runtime-metrics");
        startRuntimeMetrics((metrics) => {
            console.info(JSON.stringify(metrics));
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
