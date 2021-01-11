const express = require('express');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const fs = require('fs');
const bodyParser = require('body-parser');
const compression = require('compression');
const searchApiConsumer = require('./api/searchApiConsumer');
const htmlMeta = require('./common/htmlMeta');
const locationApiConsumer = require('./api/locationApiConsumer');
const { initialize } = require('unleash-client');

/* eslint no-console: 0 */


const currentDirectory = __dirname;
const rootDirectory = `${currentDirectory}/../`;
const server = express();
const port = process.env.PORT || 8080;
server.set('port', port);

const instrumentation = require('./instrumentation').setup(server);

const pageHitCounter = instrumentation.pageHitCounter();

// Cache locations from adusers and reuse them
let locationsFromAduser = null;
let locationsFromFile = [];

locationApiConsumer.fetchAndProcessLocations().then(res => {
    if (res !== null) {
        locationsFromAduser = res;
    }
});

fs.readFile(__dirname + '/api/resources/locations.json', 'utf-8',
    function (err, data) {
        locationsFromFile = err ? [] : JSON.parse(data);
    });

server.disable('x-powered-by');
server.use(compression());

/**
 Hotjar requires a bunch of CSP exceptions.
 Not super happy about 'unsafe-eval' 'unsafe-inline', remove them if they are not needed in the future.
 From here https://help.hotjar.com/hc/en-us/articles/115011640307-Content-Security-Policies
 */
const hotJarSources = {
    img: ['https://script.hotjar.com', 'http://script.hotjar.com'],
    script: ['http://static.hotjar.com', 'https://static.hotjar.com', 'https://script.hotjar.com'],
    connect: ['http://*.hotjar.com:*', 'https://*.hotjar.com:*', 'https://vc.hotjar.io:*', 'wss://*.hotjar.com'],
    frame: ['https://vars.hotjar.com'],
    font: ['http://script.hotjar.com', 'https://script.hotjar.com'],
    UNSAFE: ["'unsafe-eval'", "'unsafe-inline'"]
};


// En del sikkerhets headere er allerede lagt i bigip, dropper de derfor her for å unngå duplkiate headere
server.use(helmet({xssFilter: false, hsts: false, noSniff: false, frameguard: false}));

server.use(helmet.referrerPolicy({policy: 'no-referrer'}));

server.use(helmet.contentSecurityPolicy({
    directives: {
        defaultSrc: ["'none'"],
        baseUri: ["'none'"],
        mediaSrc: ["'none'"],
        scriptSrc: ["'self'", 'https://www.google-analytics.com', ...hotJarSources.script, ...hotJarSources.UNSAFE],
        objectSrc: ["'none'"],
        frameAncestors: ["'none'"],
        formAction: ["'self'"],
        styleSrc: ["'self'", hotJarSources.UNSAFE[1]],
        fontSrc: ["'self'", 'data:', 'https://fonts.gstatic.com', ...hotJarSources.font],
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com', ...hotJarSources.img],
        connectSrc: ["'self'", process.env.PAMADUSER_URL, 'https://www.google-analytics.com', 'https://amplitude.nav.no', ...hotJarSources.connect],
        frameSrc: ["'self'", ...hotJarSources.frame]
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
    PAM_VAR_SIDE_URL: process.env.PAM_VAR_SIDE_URL,
    AMPLITUDE_TOKEN: process.env.AMPLITUDE_TOKEN,
    NY_CV_URL: process.env.NY_CV_URL,
    UNLEASH_URL: process.env.UNLEASH_URL
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent = `window.__PAM_STILLINGSOK_URL__="${fasitProperties.PAM_STILLINGSOK_URL}";\n`
        + `window.__PAM_CONTEXT_PATH__="${fasitProperties.PAM_CONTEXT_PATH}";\n`
        + `window.__PAM_AD_USER_API__="${fasitProperties.PAM_AD_USER_API}";\n`
        + `window.__LOGIN_URL__="${fasitProperties.LOGIN_URL}";\n`
        + `window.__LOGOUT_URL__="${fasitProperties.LOGOUT_URL}";\n`
        + `window.__PAM_VAR_SIDE_URL__="${fasitProperties.PAM_VAR_SIDE_URL}";\n`
        + `window.__AMPLITUDE_TOKEN__="${fasitProperties.AMPLITUDE_TOKEN}";\n`
        + `window.__NY_CV_URL__="${fasitProperties.NY_CV_URL}";\n`;

    fs.writeFile(path.resolve(rootDirectory, 'dist/js/env.js'), fileContent, (err) => {
        if (err) throw err;
    });
};
const renderSok = (htmlPages) => (
    new Promise((resolve, reject) => {
        server.render(
            'index.html',
            {
                title: htmlMeta.getDefaultTitle(),
                description: htmlMeta.getDefaultDescription()
            },
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

const unleash = initialize({
    url: fasitProperties.UNLEASH_URL,
    appName: 'pam-stillingsok'
})

const oneWeek = 604800;
const newCvRollbackFeatureToggle = `pam-cv.new-cv-rollback${process.env.NAIS_CLUSTER_NAME.includes('dev') ? '-dev' : ''}`;
const showAdStatisticsLinkToggle = `pam-stillingsok.show-add-statistics-link${process.env.NAIS_CLUSTER_NAME.includes('dev') ? '-dev' : ''}`;


const startServer = (htmlPages) => {
    writeEnvironmentVariablesToFile();

    server.use((req, res, next) => {
        if (req.path.includes('internal')) {
            return next();
        }
        if ((req && req.headers.cookie && !req.headers.cookie.includes('amplitudeIsEnabled')) || !req.headers.cookie){
            res.cookie('amplitudeIsEnabled', true, { maxAge: oneWeek * 2, domain: '.nav.no' });
        }
        if ((req && req.headers.cookie && !req.headers.cookie.includes('showAdStatisticsLink'))) {
            res.cookie('showAdStatisticsLink', unleash.isEnabled(showAdStatisticsLinkToggle, {}), { maxAge: oneWeek * 4, domain: '.nav.no' });
        }

        if ((req && req.headers.cookie
            && req.headers.cookie.includes('newCvRolloutGroup'))
            // NOTE: Using pam-cv's feature toggle, since the rollback happens on both apps.
            && unleash.isEnabled(newCvRollbackFeatureToggle, {})) {

            res.cookie('newCvRolloutGroup', false, { maxAge: oneWeek * 4, domain: '.nav.no' });
            res.cookie('useNewCv', false, { maxAge: oneWeek * 4, domain: '.nav.no' })
        }
        next();
    });

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

    // Give users fallback locations from local file if aduser is unresponsive
    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/locations`, (req, res) => {
        if (locationsFromAduser === null) {
            locationApiConsumer.fetchAndProcessLocations().then(locationRes => {
                if (locationRes === null) {
                    res.send(locationsFromFile);
                } else {
                    locationsFromAduser = locationRes;
                    res.send(locationsFromAduser);
                }
            });
        } else {
            res.send(locationsFromAduser);
        }
    });

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        searchApiConsumer.search(req.query)
            .catch((err) => {
                console.warn('Failed to query search api', err);
                res.status(err.statusCode ? err.statusCode : 502); // For TCP level errors, no http status code will be available
            })
            .then((val) => res.send(val));
    });

    server.post(`${fasitProperties.PAM_CONTEXT_PATH}/instrumentation`, (req, res) => {
        if (req.body && req.body.page
            && (req.body.page === '/stillinger/favoritter'
                || req.body.page === '/stillinger/lagrede-sok'
                || req.body.page === '/stillinger/stilling'
                || req.body.page === '/stillinger')) {
            pageHitCounter.inc(req.body.page, req.body.source);
        }
        res.status(200).send({});
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
            .then((result) => res.send(result));
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

    server.get(`${fasitProperties.PAM_CONTEXT_PATH}/api/intern/:uuid`, async (req, res) => {
        searchApiConsumer.fetchInternStilling(req.params.uuid)
            .catch((err) => {
                console.warn('Failed to fetch stilling with uuid', req.params.uuid);
                res.status(err.statusCode ? err.statusCode : 502);
            })
            .then((val) => res.send(val));
    });

    server.get('/', (req, res) => {
        res.redirect(`${fasitProperties.PAM_CONTEXT_PATH}`)
    });

    server.get(/^\/pam-stillingsok.*$/, (req, res) => {
        var url = req.url.replace("/pam-stillingsok", `${fasitProperties.PAM_CONTEXT_PATH}`);
        res.redirect(`${url}`)
    });

    server.get(['/stillinger/stilling/:uuid'], (req, res) => {
        searchApiConsumer.fetchStilling(req.params.uuid)
            .then((data) => {
                try {
                    res.render('index', {
                        title: htmlMeta.getStillingTitle(data._source),
                        description: htmlMeta.getStillingDescription(data._source)
                    });
                } catch (err) {
                    res.send(htmlPages.sok);
                }
            })
            .catch((err) => {
                res.send(htmlPages.sok);
            });
        }
    );

    server.get('/stillinger/intern/:uuid', (req, res) => {
            searchApiConsumer.fetchInternStilling(req.params.uuid)
                .then((data) => {
                    try {
                        res.render('index', {
                            title: htmlMeta.getStillingTitle(data._source),
                            description: htmlMeta.getStillingDescription(data._source)
                        });
                    } catch (err) {
                        res.send(htmlPages.sok);
                    }
                })
                .catch((err) => {
                    res.send(htmlPages.sok);
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
