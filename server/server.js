
const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const fs = require('fs');
const prometheus = require('prom-client');
const bodyParser = require('body-parser');
const compression = require('compression');
const searchApiConsumer = require('./api/searchApiConsumer');
const getEmployer = require('./common/getEmployer');
const getWorkLocation = require('./common/getWorkLocation');
const  date = require('./common/date');

/* eslint no-console: 0 */

prometheus.collectDefaultMetrics();

const currentDirectory = __dirname;
const rootDirectory = `${currentDirectory}/../`;
const server = express();
const port = process.env.PORT || 8080;
server.set('port', port);

server.disable('x-powered-by');
server.use(compression());
server.use(helmet({ xssFilter: false }));

server.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        scriptSrc: ["'self'", 'https://www.google-analytics.com'],
        styleSrc: ["'self'"],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com'],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
        connectSrc: ["'self'", process.env.PAMADUSER_URL, 'https://www.google-analytics.com']
    }
}));

server.set('views', `${rootDirectory}views`);
server.set('view engine', 'html');
server.engine('html', mustacheExpress());

server.use(bodyParser.json());

const fasitProperties = {
    PAM_CONTEXT_PATH: '/stillinger',
    PAM_AD_USER_API: `${process.env.PAMADUSER_URL}/aduser`,
    LOGIN_URL: process.env.LOGINSERVICE_URL,
    LOGOUT_URL: process.env.LOGOUTSERVICE_URL,
    PAM_STILLINGSOK_URL: process.env.PAM_STILLINGSOK_URL,
    PAM_VAR_SIDE_URL: process.env.PAM_VAR_SIDE_URL
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent = `window.__PAM_STILLINGSOK_URL__="${fasitProperties.PAM_STILLINGSOK_URL}";\n`
        + `window.__PAM_CONTEXT_PATH__="${fasitProperties.PAM_CONTEXT_PATH}";\n`
        + `window.__PAM_AD_USER_API__="${fasitProperties.PAM_AD_USER_API}";\n`
        + `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n`
        + `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n`
        + `window.__PAM_VAR_SIDE_URL__="${fasitProperties.PAM_VAR_SIDE_URL}";\n`;

    fs.writeFile(path.resolve(rootDirectory, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};
const renderSok = (htmlPages) => (
    new Promise((resolve, reject) => {
        server.render(
            'index.html',
            {
                title: 'Ledige stillinger - Arbeidsplassen',
                description: 'Søk etter ledige stillinger. Heltid- og deltidsjobber i offentlig og privat sektor i Oslo, Bergen, Trondheim, Stavanger, Tromsø og alle kommuner i Norge'
            },
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
        express.static(path.resolve(rootDirectory, 'dist/js'))
    );

    server.use(`${fasitProperties.PAM_CONTEXT_PATH}/css`,
        express.static(path.resolve(rootDirectory, 'dist/css'))
    );

    server.use(
        `${fasitProperties.PAM_CONTEXT_PATH}/images`,
        express.static(path.resolve(rootDirectory, 'images'))
    );

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        searchApiConsumer.search(req.query)
            .catch((err) => {
                console.warn('Failed to query search api', err);
                res.status(err.statusCode ? err.statusCode : 502); // For TCP level errors, no http status code will be available
            })
            .then((val) => res.send(val));
    });

    server.post(`${fasitProperties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        searchApiConsumer.search(req.body)
            .catch((err) => {
                console.warn('Failed to query search api', err);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then((val) => res.send(val));
    });

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        searchApiConsumer.suggestions(req.query)
            .catch((err) => {
                console.warn('Failed to fetch suggestions,', err);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then( (result) => res.send(result));
    });

    server.post(`${fasitProperties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        searchApiConsumer.suggestions(req.body)
            .catch((err) => {
                console.warn('Failed to fetch suggestions,', err);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then((result) => res.send(result));
    });

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/stilling/:uuid`, async (req, res) => {
        searchApiConsumer.fetchStilling(req.params.uuid)
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
        ['/stillinger/stilling/:uuid'],
        (req, res) => {
            searchApiConsumer.fetchStilling(req.params.uuid)
                .catch((err) => {
                    res.send(htmlPages.sok);
                })
                .then((data) => {
                    try {
                        // Lager meta description content
                        // f.eks "Brukerstyrt personlig assistent, Firmaet AS, Drammen. Søknadsfrist: Snarest"
                        if (data._source && data._source.title && data._source.properties) {
                            const descriptionFragments = [];
                            const employer = getEmployer(data._source);
                            const location = getWorkLocation(data._source.properties.location, data._source.locationList);

                            const commaSeparatedFragments = [];
                            if (data._source.properties.jobtitle && data._source.title !== data._source.properties.jobtitle) {
                                commaSeparatedFragments.push(data._source.properties.jobtitle)
                            }
                            if (employer) {
                                commaSeparatedFragments.push(employer)
                            }
                            if (data._source.properties.location) {
                                commaSeparatedFragments.push(location)
                            }

                            if (commaSeparatedFragments.length > 0) {
                                descriptionFragments.push(commaSeparatedFragments.join(', '));
                            }

                            if (data._source.properties.applicationdue) {
                                const applicationDue = date.formatISOString(data._source.properties.applicationdue, 'DD.MM.YYYY');
                                descriptionFragments.push(`Søknadsfrist: ${applicationDue}`)
                            }

                            res.render('index', {
                                title: data._source.title,
                                description: `${descriptionFragments.join('. ')}. Her kan du se hele stillingen, sende søknad eller finne andre ledige stillinger fra ${employer || 'samme arbeidsgiver'}.`
                            })
                        } else if (data._source && data._source.title) {
                            res.render('index', {
                                title: data._source.title,
                                description: ''
                            })
                        } else {
                            res.send(htmlPages.sok);
                        }
                    } catch (err) {
                        res.send(htmlPages.sok);
                    }
                });
        }
    );

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
