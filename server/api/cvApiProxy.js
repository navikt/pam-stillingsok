const {createProxyMiddleware} = require("http-proxy-middleware");
const { v4: uuidv4 } = require('uuid');
const {getTokenX} = require("../tokenX/tokenXUtils");
const CV_API_URL = process.env.CV_API_URL ||'http://localhost:1337';
const isLocal = process.env.BASE_URL && process.env.BASE_URL.includes('localhost') || process.env.IS_LOCAL === 'true';

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
                console.log(`Det er ikke en callid fra før, lager en ny callid: ${callId}`);
            }
            proxyReq.setHeader('nav-callid', callId);
            proxyReq.setHeader('Authorization', `${req.headers.authorization}`)
        }
    });
    server.use('/stillinger/headerinfo',
        setTokenX,
        proxySetting);
}

const setTokenX = async (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    const tokenX = await getToken(accessToken);
    req.headers['authorization'] = `Bearer ${tokenX.access_token}`;

    next();
}

const getToken = async (accessToken) => {
    return await getTokenX(accessToken);
}

module.exports = setUpProxyCvApi;