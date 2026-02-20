import { createRequire } from "module";
import { withSentryConfig } from "@sentry/nextjs";

const require = createRequire(import.meta.url);

/** Next.js sin default-liste (må kopieres inn fordi htmlLimitedBots OVERSTYRER default)
 * Kilde (samme regex vises i Next sine type-defs/Docs): :contentReference[oaicite:2]{index=2}
 * hentet herfra: https://github.com/vercel/next.js/blob/canary/packages/next/src/shared/lib/router/utils/html-bots.ts
 */

const nextDefaultHtmlLimitedBots =
    /[\w-]+-Google|Google-[\w-]+|Chrome-Lighthouse|Slurp|DuckDuckBot|baiduspider|yandex|sogou|bitlybot|tumblr|vkShare|quora link preview|redditbot|ia_archiver|Bingbot|BingPreview|applebot|facebookexternalhit|facebookcatalog|Twitterbot|LinkedInBot|Slackbot|Discordbot|WhatsApp|SkypeUriPreview|Yeti|googleweblight/i;

// Legg til validatorene vi bruker (W3C Markup Validator + Validator.nu / nu-html-checker)
const validatorUserAgents = /W3C_Validator|Validator\.nu\/LV|W3C-checklink/i;

/**
 * @type {import('next').NextConfig}
 */
const baseConfig = {
    basePath: "",
    reactStrictMode: true,
    htmlLimitedBots: new RegExp(`${nextDefaultHtmlLimitedBots.source}|${validatorUserAgents.source}`, "i"),
    cacheHandler: require.resolve("./cache-handler.mjs"),
    transpilePackages: ["@navikt/arbeidsplassen-react"],
    experimental: {
        optimizePackageImports: ["@navikt/ds-react", "@navikt/aksel-icons"],
    },
    assetPrefix: process.env.ASSET_PREFIX || undefined,
    output: "standalone",
    serverExternalPackages: ["canvas", "jsdom", "@navikt/next-logger", "next-logger", "pino", "pino-socket"],
    env: {
        STILLINGSREGISTRERING_PATH: "/stillingsregistrering",
    },
    logging: {
        fetches: {
            fullUrl: true,
            hmrRefreshes: true,
        },
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
        qualities: [25, 50, 75],
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
