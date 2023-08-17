const { createProxyMiddleware } = require("http-proxy-middleware");
const { v4: uuidv4 } = require("uuid");
const { getTokenX } = require("../tokenX/tokenXUtils");
const { logger } = require("../common/logger");

const isLocal =
    (process.env.ARBEIDSPLASSEN_URL && process.env.ARBEIDSPLASSEN_URL.includes("localhost")) ||
    process.env.IS_LOCAL === "true";

const audience = process.env.ADUSER_AUDIENCE;

const origins = [
    "/stillinger/api/v1/user",
    "/stillinger/api/v1/userfavouriteads/:uuid",
    "/stillinger/api/v1/userfavouriteads",
    "/stillinger/api/v1/reportposting",
    "/stillinger/api/v1/savedsearches/:uuid",
    "/stillinger/api/v1/savedsearches",
];

const setCallId = async (req, res, next) => {
    let callId = req.headers["nav-callid"];

    // sjekker om headeren finnes
    if (callId === undefined || callId === null) {
        callId = uuidv4();
        logger.info(`Lager en callId ${callId} for ${req.url} med ${req.method}`);
    }
    req.headers["nav-callid"] = callId;
    next();
};
const getToken = async (accessToken) => getTokenX(accessToken, audience);

const setTokenX = async (req, res, next) => {
    if (req.headers.authorization) {
        const accessToken = req.headers.authorization.split(" ")[1];
        const tokenX = await getToken(accessToken);
        req.headers.authorization = `Bearer ${tokenX.access_token}`;
    } else {
        res.redirect("/oauth2/login");
    }
    next();
};
const restream = (proxyReq, req) => {
    if (req.body && (req.method === "PUT" || req.method === "POST")) {
        const bodyData = JSON.stringify(req.body);
        // incase if content-type is application/x-www-form-urlencoded -> we need to change to application/json
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        // stream the content
        proxyReq.write(bodyData);
    }
};

const setupProxy = createProxyMiddleware({
    target: process.env.PAMADUSER_URL,
    pathRewrite: { "^/stillinger/": "/" },
    changeOrigin: true,
    secure: !isLocal,
    onProxyReq: restream,
});

const setUpAduserApiProxy = (server) => {
    origins.forEach((origin) => {
        server.get(origin, setCallId, setTokenX, setupProxy);
        server.delete(origin, setCallId, setTokenX, setupProxy);
        server.post(origin, setCallId, setTokenX, setupProxy);
        server.put(origin, setCallId, setTokenX, setupProxy);
    });
};

module.exports = setUpAduserApiProxy;
