/** @type {import('next').NextConfig} */

import { createRequire } from "module";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";

const require = createRequire(import.meta.url);

const baseConfig = {
    basePath: "/stillinger",
    cacheHandler: process.env.NODE_ENV === "production" ? require.resolve("./cache-handler.mjs") : undefined,
    transpilePackages: ["@navikt/arbeidsplassen-react"],
    experimental: {
        optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
        instrumentationHook: true,
    },
    assetPrefix: process.env.ASSET_PREFIX || undefined,
    output: "standalone",
    eslint: {
        ignoreDuringBuilds: true,
    },
    env: {
        STILLINGSREGISTRERING_PATH: "/stillingsregistrering",
    },
};

const withBundle = withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

// Konfigurer Sentry med bundle-analyzer
const nextConfig = withSentryConfig(
    withBundle(baseConfig),
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
export default nextConfig;
