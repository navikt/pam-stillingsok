const express = require("express");
const helmet = require("helmet");
const path = require("path");
const mustacheExpress = require("mustache-express");
const Promise = require("promise");
const fs = require("fs");
const bodyParser = require("body-parser");
const compression = require("compression");
const searchApiConsumer = require("./api/searchApiConsumer");
const htmlMeta = require("./common/htmlMeta");
const locationApiConsumer = require("./api/locationApiConsumer");
const setUpProxyCvApi = require("./api/cvApiProxy");
const { initializeTokenX, tokenIsValid } = require("./tokenX/tokenXUtils");
const setUpAduserApiProxy = require("./api/userApiProxyConfig");

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

fs.readFile(__dirname + "/api/resources/locations.json", "utf-8", function (err, data) {
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
            styleSrc: ["'self'", "https://fonts.googleapis.com/"],
            fontSrc: ["'self'", "data:", "https://fonts.gstatic.com"],
            imgSrc: ["'self'", "data:"],
            connectSrc: [
                "'self'",
                process.env.ARBEIDSPLASSEN_URL,
                process.env.INTEREST_API_URL,
                "https://amplitude.nav.no",
                "https://sentry.gc.nav.no"
            ],
            frameSrc: ["'self'"]
        }
    })
);

server.set("views", `${rootDirectory}views`);
server.set("view engine", "html");
server.engine("html", mustacheExpress());

server.use(bodyParser.json());

const properties = {
    PAM_CONTEXT_PATH: "/stillinger",
    INTEREST_API_URL: process.env.INTEREST_API_URL,
    LOGIN_URL: "/oauth2/login",
    LOGOUT_URL: "/oauth2/logout",
    PAM_STILLINGSOK_URL: process.env.PAM_STILLINGSOK_URL,
    PAM_VAR_SIDE_URL: process.env.PAM_VAR_SIDE_URL,
    PAM_JOBBTREFF_API_URL: process.env.PAM_JOBBTREFF_API_URL,
    AMPLITUDE_TOKEN: process.env.AMPLITUDE_TOKEN
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
        `window.__AMPLITUDE_TOKEN__="${properties.AMPLITUDE_TOKEN}";\n`;

    fs.writeFile(path.resolve(rootDirectory, "dist/js/env.js"), fileContent, (err) => {
        if (err) throw err;
    });
};
const renderSok = (htmlPages) =>
    new Promise((resolve, reject) => {
        server.render(
            "index.html",
            {
                title: htmlMeta.getDefaultTitle(),
                description: htmlMeta.getDefaultDescription()
            },
            (err, html) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Object.assign({ sok: html }, htmlPages));
                }
            }
        );
    });

const startServer = (htmlPages) => {
    writeEnvironmentVariablesToFile();

    server.use(`${properties.PAM_CONTEXT_PATH}/js`, express.static(path.resolve(rootDirectory, "dist/js")));

    server.use(`${properties.PAM_CONTEXT_PATH}/css`, express.static(path.resolve(rootDirectory, "dist/css")));

    server.use(`${properties.PAM_CONTEXT_PATH}/images`, express.static(path.resolve(rootDirectory, "images")));

    server.get(`${properties.PAM_CONTEXT_PATH}/isAuthenticated`, async (req, res) => {
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
    initializeTokenX();
    setUpProxyCvApi(server);

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
                console.warn("Failed to query search api", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.post(`${properties.PAM_CONTEXT_PATH}/api/search`, async (req, res) => {
        searchApiConsumer
            .search(req.body)
            .then((val) => res.send(val))
            .catch((err) => {
                console.warn("Failed to query search api", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        searchApiConsumer
            .suggestions(req.query)
            .then((result) => res.send(result))
            .catch((err) => {
                console.warn("Failed to fetch suggestions,", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.post(`${properties.PAM_CONTEXT_PATH}/api/suggestions`, async (req, res) => {
        searchApiConsumer
            .suggestions(req.body)
            .then((result) => res.send(result))
            .catch((err) => {
                console.warn("Failed to fetch suggestions,", err);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/api/stilling/:uuid`, async (req, res) => {
        searchApiConsumer
            .fetchStilling(req.params.uuid)
            .then((val) => res.send(val))
            .catch((err) => {
                console.warn("Failed to fetch stilling with uuid", req.params.uuid);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/api/intern/:uuid`, async (req, res) => {
        searchApiConsumer
            .fetchInternStilling(req.params.uuid)
            .then((val) => res.send(val))
            .catch((err) => {
                console.warn("Failed to fetch stilling with uuid", req.params.uuid);
                res.sendStatus(err.statusCode ? err.statusCode : 500);
            });
    });

    server.get("/", (req, res) => {
        res.redirect(`${properties.PAM_CONTEXT_PATH}`);
    });

    server.get(/^\/pam-stillingsok.*$/, (req, res) => {
        var url = req.url.replace("/pam-stillingsok", `${properties.PAM_CONTEXT_PATH}`);
        res.redirect(`${url}`);
    });

    server.get(["/stillinger/stilling/:uuid"], (req, res) => {
        searchApiConsumer
            .fetchStilling(req.params.uuid)
            .then((data) => {
                try {
                    res.render("index", {
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
    });

    server.get("/stillinger/intern/:uuid", (req, res) => {
        searchApiConsumer
            .fetchInternStilling(req.params.uuid)
            .then((data) => {
                if (data) {
                }
                try {
                    res.render("index", {
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
    });

    server.get(["/stillinger/?", /^\/stillinger\/(?!.*dist).*$/], (req, res) => {
        res.send(htmlPages.sok);
    });

    server.get(`${properties.PAM_CONTEXT_PATH}/internal/isAlive`, (req, res) => res.sendStatus(200));
    server.get(`${properties.PAM_CONTEXT_PATH}/internal/isReady`, (req, res) => res.sendStatus(200));

    server.get(`${properties.PAM_CONTEXT_PATH}/internal/metrics`, (req, res) => {
        res.set("Content-Type", prometheus.register.contentType);
        res.end(prometheus.register.metrics());
    });

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

renderSok({}).then(startServer, (error) => console.error("Failed to render app", error));
