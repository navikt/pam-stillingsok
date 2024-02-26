const cspHeader = `
    default-src 'none';
    script-src 'self';
    style-src 'self';
    img-src 'self' data:;
    media-src 'none';
    font-src 'self' data:;
    object-src 'none';
    base-uri 'none';
    form-action 'self';
    frame-ancestors 'none';
    frame-src 'self';
    block-all-mixed-content;
    upgrade-insecure-requests;
    connect-src 'self' ${process.env.ARBEIDSPLASSEN_URL} ${process.env.INTEREST_API_URL} https://amplitude.nav.no https://sentry.gc.nav.no;
`;

/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/stillinger",
    async headers() {
        return [
            {
                source: "/(.*)",
                headers: [
                    {
                        key: "Content-Security-Policy",
                        value: cspHeader.replace(/\n/g, ""),
                    },
                ],
            },
        ];
    },
};

module.exports = nextConfig;
