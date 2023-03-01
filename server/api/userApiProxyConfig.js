const {createProxyMiddleware} = require('http-proxy-middleware');

const setUpAduserApiProxy = (server) => {
    const url = 'stillinger/api/v1/';

    server.get(`^\/stillinger\/api\/v1\/.*`,
        async (req, res) => {
            console.log("henter stillinger/api/v1");
        },
        //handleAuth?
        //setCallId
        //setTokenX

        setupProxy(`/^\/${url}.*$/`)
    );

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

const setupProxy = (originUrl) =>
    createProxyMiddleware(originUrl, {
        target: process.env.PAMADUSER_URL,
        pathRewrite: {'^/stillinger/': '/'},
        changeOrigin: true
        // secure: !isLocal,
    });

module.exports = setUpAduserApiProxy