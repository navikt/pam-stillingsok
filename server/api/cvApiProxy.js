const { createProxyMiddleware } = require("http-proxy-middleware");
const { v4: uuidv4 } = require("uuid");
const { getTokenX } = require("../tokenX/tokenXUtils");
const { logger } = require("../common/logger");

const CV_API_URL = process.env.CV_API_URL || "http://localhost:1337";
const isLocal =
    (process.env.ARBEIDSPLASSEN_URL && process.env.ARBEIDSPLASSEN_URL.includes("localhost")) ||
    process.env.IS_LOCAL === "true";

const audience = process.env.CV_API_AUDIENCE;

const setTokenX = async (req, res, next) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(" ")[1];
        const tokenX = await getTokenX(accessToken, audience);
        if (tokenX === null) {
            res.status(401).send("Det skjedde noe feil under utveksling av token");
        }
        req.headers.authorization = `Bearer ${tokenX.access_token}`;
    } else {
        res.redirect("/oauth2/login");
    }
    next();
};

const setUpProxyCvApi = (server) => {
    const proxySetting = createProxyMiddleware(`/stillinger/headerinfo`, {
        target: `${CV_API_URL}/pam-cv-api/rest/person`,
        pathRewrite: { "^/stillinger/headerinfo": "/headerinfo" },
        changeOrigin: true,
        secure: !isLocal,
        logLevel: "debug",
        onProxyReq: (proxyReq, req) => {
            let callId = req.headers["nav-callid"];
            if (callId === undefined || callId === null) {
                callId = uuidv4();
                logger.info(`Det er ikke en callid fra før, lager en ny callid til pam-cv-api: ${callId}`);
            }
            proxyReq.setHeader("nav-callid", callId);
            proxyReq.setHeader("Authorization", `${req.headers.authorization}`);
        },
    });

    server.use("/stillinger/headerinfo", setTokenX, proxySetting);
};

module.exports = setUpProxyCvApi;
