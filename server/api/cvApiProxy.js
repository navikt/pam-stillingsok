const {createProxyMiddleware} = require("http-proxy-middleware");
const { v4: uuidv4 } = require('uuid');
const {getTokenX} = require("../tokenX/tokenXUtils");
const CV_API_URL = process.env.CV_API_URL ||'http://localhost:1337';
const isLocal = process.env.ARBEIDSPLASSEN_URL && process.env.ARBEIDSPLASSEN_URL.includes('localhost') || process.env.IS_LOCAL === 'true';

let audience = process.env.CV_API_AUDIENCE;

const setUpProxyCvApi = (server) => {
    const proxySetting = createProxyMiddleware(`/stillinger/headerinfo`, {
        target: `${CV_API_URL}/pam-cv-api/rest/person`,
        pathRewrite: {'^/stillinger/headerinfo': '/headerinfo'},
        changeOrigin: true,
        secure: !isLocal,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req) => {
            let callId = req.headers['nav-callid'];
            if (callId === undefined || callId === null) {
                callId = uuidv4();
                console.log(`Det er ikke en callid fra før, lager en ny callid til pam-cv-api: ${callId}`);
            }
            proxyReq.setHeader('nav-callid', callId);
            proxyReq.setHeader('Authorization', `${req.headers.authorization}`)
        }
    });
    // redirect til login hvis ikke auth-header?
    //legge på middleware siden endepunktet er beskyttet
    server.use('/stillinger/headerinfo',
        setTokenX,
        proxySetting);
}

const setTokenX = async (req, res, next) => {
    if(req.headers.authorization) {
        const accessToken = req.headers.authorization.split(' ')[1];
        const tokenX = await getToken(accessToken);
        req.headers['authorization'] = `Bearer ${tokenX.access_token}`;
    }

    next();
}

const getToken = async (accessToken) => {
    return await getTokenX(accessToken, audience);
}

module.exports = setUpProxyCvApi;