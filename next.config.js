/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/stillinger",
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
                  project: "arbeidsplassen",
                  url: "https://sentry.gc.nav.no/",
              },
              {
                  widenClientFileUpload: true,
                  tunnelRoute: "/monitoring",
                  hideSourceMaps: true,
              },
          );
