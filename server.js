const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const fs = require('fs');
const prometheus = require('prom-client');
const bodyParser = require('body-parser');
const searchApiConsumer = require('./scripts/searchApiConsumer');
const { searchTemplate, suggestionsTemplate } = require('./scripts/searchApiTemplates');

prometheus.collectDefaultMetrics();

const currentDirectory = __dirname;
const server = express();
const port = process.env.PORT || 8080;
server.set('port', port);

server.disable('x-powered-by');
server.use(helmet());

server.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", 'https://www.google-analytics.com'],
        styleSrc: ["'self'"],
        fontSrc: ["'self'", 'data:'],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com',
            'https://www.nav.no/_public/beta.nav.no/images/logo.png'],
        connectSrc: ["'self'", process.env.PAMADUSER_URL,  'https://www.google-analytics.com']
    }
}));

server.set('views', `${currentDirectory}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

server.use(bodyParser.json());

const fasitProperties = {
    PAM_CONTEXT_PATH: '/pam-stillingsok',
    PAM_SEARCH_API: '/pam-stillingsok/search-api',
    PAM_STILLING: '/pam-stillingsok/stilling/',
    PAM_AD_USER_API: process.env.PAMADUSER_URL + '/aduser',
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL,
    PAM_STILLINGSOK_URL: process.env.PAM_STILLINGSOK_URL
};


const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_STILLINGSOK_URL__="${fasitProperties.PAM_STILLINGSOK_URL}";\n` +
        `window.__PAM_CONTEXT_PATH__="${fasitProperties.PAM_CONTEXT_PATH}";\n` +
        `window.__PAM_STILLING__="${fasitProperties.PAM_STILLING}";\n` +
        `window.__PAM_AD_USER_API__="${fasitProperties.PAM_AD_USER_API}";\n` +
        `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n` +
        `window.__PAM_SEARCH_API__="${fasitProperties.PAM_SEARCH_API}";\n`;

    fs.writeFile(path.resolve(__dirname, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};
const renderSok = (htmlPages) => (
    new Promise((resolve, reject) => {
        server.render(
            'index.html',
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Object.assign({sok: html}, htmlPages));
                }
            }
        );
    })
);

const startServer = (htmlPages) => {
    writeEnvironmentVariablesToFile();

    server.use(
        '/pam-stillingsok/search-api',
        proxy('http://pam-search-api')
    );

    server.use(
        '/pam-stillingsok/js',
        express.static(path.resolve(__dirname, 'dist/js'))
    );
    server.use(
        '/pam-stillingsok/css',
        express.static(path.resolve(__dirname, 'dist/css'))
    );

    server.get('/pam-stillingsok/search', async function(req, res) {
        const result = await searchApiConsumer.search(searchTemplate, req.query)
            .catch((err) => { logError('Failed to query search api', err)});

        res.send(result);
    });

    server.get('/pam-stillingsok/suggestions', async function(req, res) {
        const result = await searchApiConsumer.search(suggestionsTemplate, req.query)
            .catch((err) => { logError('Failed to query search api', err)});

        res.send(result);
    });

    server.get(
        ['/', '/pam-stillingsok/?', /^\/pam-stillingsok\/(?!.*dist).*$/],
        (req, res) => {
            res.send(htmlPages.sok);
        }
    );

    server.get('/pam-stillingsok/internal/isAlive', (req, res) => res.sendStatus(200));
    server.get('/pam-stillingsok/internal/isReady', (req, res) => res.sendStatus(200));

    server.get('/metrics', (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });

    server.post('/pam-stillingsok/search', async function(req, res) {
        const result = await searchApiConsumer.search(searchTemplate, req.body)
            .catch((err) => { logError('Failed to query search api', err)});

        res.send(result);
    });

    server.post('/pam-stillingsok/suggestions', async function(req, res) {
        const result = await searchApiConsumer.search(suggestionsTemplate, req.body)
            .catch((err) => { logError('Failed to query search api', err)});

        res.send(result);
    });

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok({})
    .then(startServer, (error) => logError('Failed to render app', error));
