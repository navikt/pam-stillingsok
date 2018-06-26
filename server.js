const express = require('express');
const proxy = require('express-http-proxy');
const helmet = require('helmet');
const path = require('path');
const mustacheExpress = require('mustache-express');
const Promise = require('promise');
const fs = require('fs');

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
        imgSrc: ["'self'", 'data:', 'https://www.google-analytics.com'],
        connectSrc: ["'self'", 'https://www.google-analytics.com']
    }
}));

server.set('views', `${currentDirectory}/views`);
server.set('view engine', 'mustache');
server.engine('html', mustacheExpress());

const fasitProperties = {
    PAM_CONTEXT_PATH: '/pam-stillingsok',
    PAM_SEARCH_API: '/pam-stillingsok/search-api',
    PAM_STILLING: '/pam-stillingsok/stilling/'
};


const writeEnvironmentVariablesToFile = () => {
    const fileContent =
        `window.__PAM_CONTEXT_PATH__="${fasitProperties.PAM_CONTEXT_PATH}";\n` +
        `window.__PAM_STILLING__="${fasitProperties.PAM_STILLING}";\n` +
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
                    resolve(Object.assign({ sok: html }, htmlPages));
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

    server.get(
        ['/', '/pam-stillingsok/?', /^\/pam-stillingsok\/(?!.*dist).*$/],
        (req, res) => {
            res.send(htmlPages.sok);
        }
    );

    server.get('/pam-stillingsok/internal/isAlive', (req, res) => res.sendStatus(200));
    server.get('/pam-stillingsok/internal/isReady', (req, res) => res.sendStatus(200));

    server.listen(port, () => {
        console.log(`Express-server startet. Server filer fra ./dist/ til localhost:${port}/`);
    });
};

const logError = (errorMessage, details) => console.log(errorMessage, details);

renderSok({})
    .then(startServer, (error) => logError('Failed to render app', error));
