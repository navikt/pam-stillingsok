const {createProxyMiddleware} = require("http-proxy-middleware");
const CV_API_URL = process.env.CV_API_URL ||'http://localhost:1337';
const isLocal = process.env.BASE_URL && process.env.BASE_URL.includes('localhost') || process.env.IS_LOCAL === 'true';


const setUpProxyCvApi = (server) => {
    console.log("Setter opp proxy til cv-api")
    const proxySetting = createProxyMiddleware(`/stillinger/headerinfo`, {
        target: `${CV_API_URL}/pam-cv-api/rest/person`,
        pathRewrite: {'^/stillinger/headerinfo': '/headerinfo'},
        changeOrigin: true,
        secure: !isLocal,
        logLevel: 'debug',
        onProxyReq: (proxyReq, req) => {
            let callId = req.headers['nav-callid'];
            if(callId === undefined || callId === null) {
                console.log("Det er ikke en callid fra før, lager en ny callid")
            }
            //console.log(`Legger til header på requesten ${req.headers.authorization}`)
            proxyReq.setHeader('Authorization', `Bearer ${req.headers.authorization}`)
        }
    });
    server.use(proxySetting);
}

module.exports = setUpProxyCvApi;