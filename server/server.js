const path = require("path");
const fs = require("fs");
const express = require("express");
const helmet = require("helmet");
const mustacheExpress = require("mustache-express");
const Promise = require("promise");
const bodyParser = require("body-parser");
const compression = require("compression");
const searchApiConsumer = require("./api/searchApiConsumer");
const htmlMeta = require("./common/htmlMeta");
const locationApiConsumer = require("./api/locationApiConsumer");
const { initializeTokenX, tokenIsValid } = require("./tokenX/tokenXUtils");
const setUpAduserApiProxy = require("./api/userApiProxyConfig");
const setUpSuperraskApi = require("./api/superraskApiProxy");
const { logger } = require("./common/logger");

/* eslint no-console: 0 */

const currentDirectory = __dirname;
const rootDirectory = `${currentDirectory}/../`;
const server = express();
const port = process.env.PORT || 8080;
server.set("port", port);

// Cache locations from adusers and reuse them
let locationsFromAduser = null;
let locationsFromFile = [];

locationApiConsumer.fetchAndProcessLocations().then((res) => {
    if (res !== null) {
        locationsFromAduser = res;
    }
});

fs.readFile(`${__dirname}/api/resources/locations.json`, "utf-8", (err, data) => {
    locationsFromFile = err ? [] : JSON.parse(data);
});

server.disable("x-powered-by");
server.use(compression());

server.use(helmet({ xssFilter: false, hsts: false }));

server.use(helmet.referrerPolicy({ policy: "no-referrer" }));

server.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'none'"],
            baseUri: ["'none'"],
            mediaSrc: ["'none'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"],
            frameAncestors: ["'none'"],
            formAction: ["'self'"],
            styleSrc: ["'self'"],
            fontSrc: ["'self'", "data:"],
            imgSrc: ["'self'", "data:"],
            connectSrc: [
                "'self'",
                process.env.ARBEIDSPLASSEN_URL,
                process.env.INTEREST_API_URL,
                "https://amplitude.nav.no",
                "https://sentry.gc.nav.no",
            ],
            frameSrc: ["'self'"],
        },
    }),
);

server.set("views", `${rootDirectory}views`);
server.set("view engine", "html");
server.engine("html", mustacheExpress());

server.use(bodyParser.json());

const getAppVersion = () => {
    // example: NAIS_APP_IMAGE=europe-north1-docker.pkg.dev/nais-management-233d/teampam/pam-stillingsok:23.256.125825
    if (process.env.NAIS_APP_IMAGE) {
        const splitted = process.env.NAIS_APP_IMAGE.split("/");
        if (splitted.length > 0) {
            const appVersion = splitted[splitted.length - 1].replace(":", "@");
            return appVersion; // example: pam-stillingsok@23.256.125825
        }
    }
    return "";
};

const properties = {
    PAM_CONTEXT_PATH: "/stillinger",
    INTEREST_API_URL: process.env.INTEREST_API_URL,
    LOGIN_URL: "/oauth2/login",
    LOGOUT_URL: "/oauth2/logout?redirect=/utlogget",
    PAM_STILLINGSOK_URL: process.env.PAM_STILLINGSOK_URL,
    PAM_VAR_SIDE_URL: process.env.PAM_VAR_SIDE_URL,
    PAM_JOBBTREFF_API_URL: process.env.PAM_JOBBTREFF_API_URL,
    AMPLITUDE_TOKEN: process.env.AMPLITUDE_TOKEN,
    SENTRY_DSN: process.env.SENTRY_DSN,
    APP_VERSION: getAppVersion(),
};

const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_STILLINGSOK_URL__="${properties.PAM_STILLINGSOK_URL}";\n` +
        `window.__PAM_CONTEXT_PATH__="${properties.PAM_CONTEXT_PATH}";\n` +
        `window.__INTEREST_API_URL__="${properties.INTEREST_API_URL}";\n` +
        `window.__LOGIN_URL__="${properties.LOGIN_URL}";\n` +
        `window.__LOGOUT_URL__="${properties.LOGOUT_URL}";\n` +
        `window.__PAM_VAR_SIDE_URL__="${properties.PAM_VAR_SIDE_URL}";\n` +
        `window.__PAM_JOBBTREFF_API_URL__="${properties.PAM_JOBBTREFF_API_URL}";\n` +
        `window.__AMPLITUDE_TOKEN__="${properties.AMPLITUDE_TOKEN}";\n` +
        `window.__SENTRY_DSN__="${properties.SENTRY_DSN}";\n` +
        `window.__APP_VERSION__="${properties.APP_VERSION}";\n`;

    fs.mkdirSync(path.resolve(rootDirectory, "dist/js"), { recursive: true });

    fs.writeFileSync(path.resolve(rootDirectory, "dist/js/env.js"), fileContent, (err) => {
        if (err) throw err;
    });
};
const renderSok = (htmlPages) =>
    new Promise((resolve, reject) => {
        server.render(
            "index.html",
            {
                title: htmlMeta.getDefaultTitle(),
                description: htmlMeta.getDefaultDescription(),
            },
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({ sok: html, ...htmlPages });
                }
            },
        );
    });

const startServer = (htmlPages) => {
    writeEnvironmentVariablesToFile();

    server.use(`${properties.PAM_CONTEXT_PATH}/js`, express.static(path.resolve(rootDirectory, "dist/js")));

    server.use(`${properties.PAM_CONTEXT_PATH}/css`, express.static(path.resolve(rootDirectory, "dist/css")));

    server.use(`${properties.PAM_CONTEXT_PATH}/public`, express.static(path.resolve(rootDirectory, "dist/public")));

    server.use(`${properties.PAM_CONTEXT_PATH}/images`, express.static(path.resolve(rootDirectory, "images")));

    server.get(`${properties.PAM_CONTEXT_PATH}/api/isAuthenticated`, async (req, res) => {
        if (req.headers.authorization) {
            const accessToken = req.headers.authorization.split(" ")[1];
            const validToken = await tokenIsValid(accessToken);
            if (validToken) {
                res.sendStatus(200);
            } else {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    });
    setUpSuperraskApi(server);

    // Give users fallback locations from local file if aduser is unresponsive
    server.get(`${properties.PAM_CONTEXT_PATH}/api/locations`, (req, res) => {
        if (locationsFromAduser === null) {
            locationApiConsumer.fetchAndProcessLocations().then((locationRes) => {
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

    setUpAduserApiProxy(server);

    server.get(`${properties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        searchApiConsumer
            .search(req.query)
            .then((val) => res.send(val))
            .catch((err) => {
                logger.warn("Failed to query search api", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.post(`${properties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        searchApiConsumer
            .search(req.body)
            .then((val) => res.send(val))
            .catch((err) => {
                logger.warn("Failed to query search api", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        searchApiConsumer
            .suggestions(req.query)
            .then((result) => res.send(result))
            .catch((err) => {
                logger.warn("Failed to fetch suggestions,", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.post(`${properties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        searchApiConsumer
            .suggestions(req.body)
            .then((result) => res.send(result))
            .catch((err) => {
                logger.warn("Failed to fetch suggestions,", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/api/stilling/:uuid`, async (req, res) => {
        searchApiConsumer
            .fetchStilling(req.params.uuid)
            .then((val) => res.send(val))
            .catch((err) => {
                logger.warn("Failed to fetch stilling with uuid", req.params.uuid);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get("/", (req, res) => {
        res.redirect(`${properties.PAM_CONTEXT_PATH}`);
    });

    server.get(/^\/pam-stillingsok.*$/, (req, res) => {
        const url = req.url.replace("/pam-stillingsok", `${properties.PAM_CONTEXT_PATH}`);
        res.redirect(`${url}`);
    });

    server.get(["/stillinger/stilling/:uuid"], (req, res) => {
        searchApiConsumer
            .fetchStilling(req.params.uuid)
            .then((data) => {
                try {
                    res.render("index", {
                        title: htmlMeta.getStillingTitle(data._source),
                        description: htmlMeta.getStillingDescription(data._source),
                    });
                } catch (err) {
                    res.send(htmlPages.sok);
                }
            })
            .catch(() => {
                res.send(htmlPages.sok);
            });
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${properties.PAM_CONTEXT_PATH}/internal/isReady`, (req, res) => res.sendStatus(200));

    // Viktig at denne kommer sist siden den vil svare på alle endepunkter under /stillinger hvis de ikke er definert før
    server.get(["/stillinger/?", /^\/stillinger\/(?!.*dist).*$/], (req, res) => {
        res.send(htmlPages.sok);
    });

    server.listen(port, () => {
        logger.info(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

initializeTokenX()
    .then(() =>
        renderSok({}).then(startServer, (error) => {
            logger.error("Failed to render app", error);
        }),
    )
    .catch((error) => {
        logger.error(`Initialisering av token-klienter feilet: ${error.message} `);
    });
