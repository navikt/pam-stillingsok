/* eslint-disable */
exports.command = function (scenarioContext) {
    const client = this;
    const sessionId = client.capabilities['webdriver.remote.sessionid'];
    const passed = scenarioContext.result.status === 'passed';
    const name = `${scenarioContext.pickle.name}`;
    const build = process.env.BUILD_TAG;

    const SauceLabs = require('saucelabs');
    const saucelabs = new SauceLabs({
        username: process.env.SAUCE_USERNAME,
        password: process.env.SAUCE_ACCESS_KEY,
        proxy: build ? 'http://webproxy-internett.nav.no:8088' : ''
    });

    saucelabs.updateJob(
        sessionId,
        {
            passed,
            name,
            build: build || ''
        },
        () => {
            client.end();
        }
    );
};
