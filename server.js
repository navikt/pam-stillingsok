const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const fs = require('fs');
const prometheus = require('prom-client');
const bodyParser = require('body-parser');
const searchApiConsumer = require('./scripts/searchApiConsumer');
const compression = require('compression');

/* eslint no-console: 0 */

prometheus.collectDefaultMetrics();

const currentDirectory = __dirname;
const server = express();
const port = process.env.PORT || 8080;
server.set('port', port);

server.disable('x-powered-by');
server.use(compression());
server.use(helmet());

server.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", 'https://www.google-analytics.com'],
        styleSrc: ["'self'"],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com',
            'https://arbeidsplassen.nav.no/images/arbeidsplassen-logo.svg'],
        connectSrc: ["'self'", process.env.PAMADUSER_URL, 'https://www.google-analytics.com']
    }
}));

server.set('views', `${currentDirectory}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

server.use(bodyParser.json());

const fasitProperties = {
    PAM_CONTEXT_PATH: '/stillinger',
    PAM_AD_USER_API: `${process.env.PAMADUSER_URL}/aduser`,
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL,
    PAM_STILLINGSOK_URL: process.env.PAM_STILLINGSOK_URL
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent = `window.__PAM_STILLINGSOK_URL__="${fasitProperties.PAM_STILLINGSOK_URL}";\n`
        + `window.__PAM_CONTEXT_PATH__="${fasitProperties.PAM_CONTEXT_PATH}";\n`
        + `window.__PAM_AD_USER_API__="${fasitProperties.PAM_AD_USER_API}";\n`
        + `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n`
        + `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n`;

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
                    resolve(Object.assign({ sok: html }, htmlPages));
                }
            }
        );
    })
);

const startServer = (htmlPages) => {
    writeEnvironmentVariablesToFile();

    server.use(`${fasitProperties.PAM_CONTEXT_PATH}/js`,
        express.static(path.resolve(__dirname, 'dist/js'))
    );

    server.use(`${fasitProperties.PAM_CONTEXT_PATH}/css`,
        express.static(path.resolve(__dirname, 'dist/css'))
    );

    server.use(
        `${fasitProperties.PAM_CONTEXT_PATH}/images`,
        express.static(path.resolve(__dirname, 'images'))
    );

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        await searchApiConsumer.search(req.query)
            .catch((err) => {
                console.warn('Failed to query search api', err);
                res.status(err.statusCode ? err.statusCode : 502); // For TCP level errors, no http status code will be available
            })
            .then((val) => res.send(val));
    });

    server.post(`${fasitProperties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        await searchApiConsumer.search(req.body)
            .catch((err) => {
                console.warn('Failed to query search api', err);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then((val) => res.send(val));
    });

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        await searchApiConsumer.suggestions(req.query)
            .catch((err) => {
                console.warn('Failed to fetch suggestions,', err);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then( (result) => res.send(result));
    });

    server.post(`${fasitProperties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        await searchApiConsumer.suggestions(req.body)
            .catch((err) => {
                console.warn('Failed to fetch suggestions,', err);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then((result) => res.send(result));
    });

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/stilling/:uuid`, async (req, res) => {
        await searchApiConsumer.fetchStilling(req.params.uuid)
            .catch((err) => {
                console.warn('Failed to fetch stilling with uuid', req.params.uuid);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then((val) => res.send(val));
    });

    server.get('/', (req,res) => {
        res.redirect(`${fasitProperties.PAM_CONTEXT_PATH}`)
    });

    server.get(/^\/pam-stillingsok.*$/, (req,res) => {
        var url = req.url.replace("/pam-stillingsok", `${fasitProperties.PAM_CONTEXT_PATH}`);
        res.redirect(`${url}`)
    })

    server.get(
        ['/stillinger/?', /^\/stillinger\/(?!.*dist).*$/],
        (req, res) => {
            res.send(htmlPages.sok);
        }
    );

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/internal/isReady`, (req, res) => res.sendStatus(200));

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/internal/metrics`, (req, res) => {
        res.set('Content-Type', prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

renderSok({})
    .then(startServer, (error) => console.error('Failed to render app', error));
