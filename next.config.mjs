import { createRequire } from "module";
import { withSentryConfig } from "@sentry/nextjs";

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
    images: {
        minimumCacheTTL: 2678400, // 31 days
        remotePatterns: [
            {
                protocol: "https",
                hostname: "cdn.nav.no",
                pathname: "/**",
            },
        ],
        unoptimized: process.env.NEXT_PUBLIC_DISABLE_IMAGE_OPTIMIZATION === "true" ? true : false,
        deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        path: "/_next/image",
        loader: "default",
    },
};

// Konfigurer Sentry med bundle-analyzer
const nextConfig = withSentryConfig(baseConfig, {
    silent: true,
    org: "nav",
    project: "pam-stillingsok",
    url: "https://sentry.gc.nav.no/",
    authToken: process.env.SENTRY_AUTH_TOKEN,
    applicationKey: "pam-stillingsok-app",
    sourcemaps: {
        assets: [".next/**/*"],
        rewriteFrame: (frame) => {
            if (frame.filename) {
                frame.filename = frame.filename
                    .replace(/^app:\/\//, "")
                    .replace(/^\.next\/server\/app\//, "src/app/")
                    .replace(/^\.next\//, "");
            }
            return frame;
        },
    },
});
export default nextConfig;
