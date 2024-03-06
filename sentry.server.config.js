import * as Sentry from "@sentry/nextjs";

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 0.1,
    debug: false,
    environment: process.env.NAIS_CLUSTER_NAME === "prod-gcp" ? "production" : "development",
});
