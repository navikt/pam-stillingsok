import { createRequire } from "module";
import { withSentryConfig } from "@sentry/nextjs";
import withBundleAnalyzer from "@next/bundle-analyzer";
// import createNextIntlPlugin from "next-intl/plugin";

// const withNextIntl = createNextIntlPlugin();

const require = createRequire(import.meta.url);

/**
 * @type {import('next').NextConfig}
 */
const baseConfig = {
    basePath: "",
    reactStrictMode: true,
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
    i18n: {
        locales: ["no", "en", "nl-NL"],
        defaultLocale: "no",
    },
};

const withBundle = withBundleAnalyzer({
    enabled: process.env.ANALYZE === "true",
});

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

// Konfigurer Sentry med bundle-analyzer
// const nextConfig = withNextIntl(
//     withSentryConfig(
//         withBundle(baseConfig),
//         {
//             silent: true,
//             org: "nav",
//             project: "pam-stillingsok",
//             url: "https://sentry.gc.nav.no/",
//             authToken: process.env.SENTRY_AUTH_TOKEN,
//         },
//         {
//             widenClientFileUpload: true,
//             tunnelRoute: "/monitoring",
//             hideSourceMaps: true,
//         },
//     ),
// );

export default nextConfig;
