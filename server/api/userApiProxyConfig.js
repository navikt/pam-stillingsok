const {createProxyMiddleware} = require('http-proxy-middleware');
const {v4: uuidv4} = require("uuid");
const {getTokenX} = require("../tokenX/tokenXUtils");
const isLocal = process.env.ARBEIDSPLASSEN_URL && process.env.ARBEIDSPLASSEN_URL.includes('localhost') || process.env.IS_LOCAL === 'true';

let audience = process.env.ADUSER_AUDIENCE;

const origins = ["/stillinger/api/v1/user", "/stillinger/api/v1/userfavouriteads",
"/stillinger/api/v1/userfavouriteads/:uuid", "/stillinger/api/v1/reportposting",
"/stillinger/api/v1/savedsearches/:uuid", "/stillinger/api/v1/savedsearches"]


const setUpAduserApiProxy = (server) => {
    const url = 'stillinger/api/v1/';
    console.log("Setter opp proxy til aduser");

    origins.forEach(origin => {
        console.log(`Origin: ${origin}`);
        server.get(origin,
            setCallId,
            setTokenX,
            setupProxy(origin)
        );
    });

    server.post(`/^\/${url}.*$/`,
        async (req, res) => {
            console.log("henter stillinger/api/v1");
        });

    server.put(`/^\/${url}.*$/`,
        async (req, res) => {

        });

    server.delete(`/^\/${url}.*$/`,
        async (req, res) => {

        });
}
const getToken = async (accessToken) => {
    return await getTokenX(accessToken, audience);
}

const setTokenX = async (req, res, next) => {
    const accessToken = req.headers.authorization.split(' ')[1];
    console.log("henter tokenX");
    const tokenX = await getToken(accessToken);
    console.log(`Hentet token`)
    req.headers['authorization'] = `Bearer ${tokenX.access_token}`;

    next();
}

const setupProxy = (originUrl) =>
   //console.log(`Oppsett proxy origin: ${originUrl}`);
    createProxyMiddleware(originUrl, {
        target: process.env.PAMADUSER_URL,
        pathRewrite: {'^/stillinger/': '/'},
        changeOrigin: true,
        secure: !isLocal,
    });

const setCallId = async ( req, res, next) => {
    let callId = req.headers['nav-callid'];
    //sjekker om headeren finnes
    if (callId === undefined || callId === null) {
        callId = uuidv4();
        console.log(`Det er ikke en callid fra før, lager en ny callid for kall til pam-aduser: ${callId}`);
    }
    req.headers['nav-callid'] = callId;
    next();
}

module.exports = setUpAduserApiProxy