const minIdPassword = process.env['QA_TEST_PASSWORD'] ? process.env['QA_TEST_PASSWORD'].split(':')[0] : undefined;
const minIdPin = process.env['QA_TEST_PASSWORD'] ? process.env['QA_TEST_PASSWORD'].split(':')[1] : undefined;

/* eslint-disable */
module.exports = {
    elements: {
        idPortenKnapp: '#IdPortenExchange',
        minIdKnapp: '#MinIDChain',
        minIdFnrFelt: '#input_USERNAME_IDPORTEN',
        minIdPwdFelt: '#input_PASSWORD_IDPORTEN',
        minIdNesteKnapp: '#nextbtn',
        minIdPinKodeFelt: '#input_PINCODE1_IDPORTEN',
    },

    commands: [{
        loggInnIdPorten(brukernavn) {
            const forside = this.api.page.SokForside();

            this
                .waitForElementVisible('@idPortenKnapp', 60000)
                .click('@idPortenKnapp')
                .minIdLogin(brukernavn);

            forside.waitForElementPresent('@searchResult', 30000);
            return this.storeLoginCookie();
        },


        minIdLogin(brukernavn) {
            return this
                .waitForElementVisible('@minIdKnapp')
                .click('@minIdKnapp')
                .waitForElementVisible('@minIdFnrFelt')
                .setValue('@minIdFnrFelt', brukernavn)
                .setValue('@minIdPwdFelt', minIdPassword)
                .click('@minIdNesteKnapp')
                .waitForElementVisible('@minIdPinKodeFelt')
                .setValue('@minIdPinKodeFelt', minIdPin)
                .click('@minIdNesteKnapp')
        },

        storeLoginCookie() {
            const self = this;

            if (this.api.options.desiredCapabilities.browserName.toLowerCase() === 'chrome') {
                this.api.getCookie('selvbetjening-idtoken', (cookie) => {
                    self.api.globals.loginCookie = {
                        domain: cookie.domain,
                        secure: cookie.secure,
                        value: cookie.value,
                        path: cookie.path,
                        httpOnly: cookie.httpOnly,
                        name: cookie.name
                    }
                });
            }
            return this;
        },

    }]
};
