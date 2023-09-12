const { createProxyMiddleware } = require("http-proxy-middleware");

const isLocal =
    (process.env.ARBEIDSPLASSEN_URL && process.env.ARBEIDSPLASSEN_URL.includes("localhost")) ||
    process.env.IS_LOCAL === "true";

const setUpSuperraskApi = (server) => {
    if (isLocal) {
        server.use(
            "/interesse-api",
            createProxyMiddleware({
                target: "https://arbeidsplassen.intern.dev.nav.no",
                changeOrigin: true,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                    "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization",
                },
            }),
        );
    }
};

module.exports = setUpSuperraskApi;
