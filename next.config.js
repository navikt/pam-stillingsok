/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/stillinger",
    cacheHandler: process.env.NODE_ENV === "production" ? require.resolve("./cache-handler.mjs") : undefined,
    experimental: {
        optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
    },
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
};

const { PHASE_DEVELOPMENT_SERVER } = require("next/constants");
const { withSentryConfig } = require("@sentry/nextjs");

module.exports = (phase) =>
    phase === PHASE_DEVELOPMENT_SERVER
        ? nextConfig
        : withSentryConfig(
              nextConfig,
              {
                  silent: true,
                  org: "nav",
                  project: "pam-stillingsok",
                  url: "https://sentry.gc.nav.no/",
                  authToken: process.env.SENTRY_AUTH_TOKEN,
              },
              {
                  widenClientFileUpload: true,
                  tunnelRoute: "/monitoring",
                  hideSourceMaps: true,
              },
          );
