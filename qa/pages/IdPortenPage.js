/* eslint-disable */
module.exports = {
    elements: {
        idPortenKnapp: '#IdPortenExchange',
        minIdKnapp: '#MinIDChain',
        bankIdKnapp: '#BankIDJS',
        minIdFnrFelt: '#input_USERNAME_IDPORTEN',
        minIdPwdFelt: '#input_PASSWORD_IDPORTEN',
        minIdNesteKnapp: '#nextbtn',
        minIdPinKodeFelt: '#input_PINCODE1_IDPORTEN',
        bankIdFrame: 'iframe[title=BankID]',
        inputFelt: 'input[data-bind]', // input-feltet ligger under shadow DOM, må derfor bruke element før og etter ::shadow
        inputFeltShadow: '.full_width_height::shadow input[data-bind]' // input-feltet ligger under shadow DOM, må derfor bruke element før og etter ::shadow
    },

    commands: [{
        loggInnIdPorten(brukernavn, loggInnType) {
            const minSidePage = this.api.page.MinSidePage();

            this
                .waitForElementVisible('@idPortenKnapp', 60000)
                .click('@idPortenKnapp');
            if (loggInnType.toLowerCase() === 'bankid') {
                this.bankIdLogin(brukernavn);
            } else {
                this.minIdLogin(brukernavn)
            }
            minSidePage.waitForElementPresent('.MinSide__illustrasjoner', 30000);
            return this.storeLoginCookie();
        },

        bankIdLogin(brukernavn) {
            const engangspassord = 'otp';
            const personligPassord = 'qwer1234';
            const inputElement = this.api.options.desiredCapabilities.browserName.toLowerCase() === 'chrome' ? '@inputFeltShadow' : '@inputFelt';

            return this
                .waitForElementVisible('@bankIdKnapp')
                .click('@bankIdKnapp')
                .waitForElementVisible('@bankIdFrame')
                .pagePause(2000)
                .switchFrame(0) // feltene ligger i en iframe
                .waitForElementVisible(inputElement, 60000)
                .setBankIdInputValue(inputElement, brukernavn)
                .waitForElementVisible(inputElement, 30000)
                .setBankIdInputValue(inputElement, engangspassord)
                .waitForElementVisible(inputElement, 30000)
                .setBankIdInputValue(inputElement, personligPassord)
                .switchFrame(null);
        },

        minIdLogin(brukernavn) {
            return this
                .waitForElementVisible('@minIdKnapp')
                .click('@minIdKnapp')
                .waitForElementVisible('@minIdFnrFelt')
                .setValue('@minIdFnrFelt', brukernavn)
                .setValue('@minIdPwdFelt', 'password01')
                .click('@minIdNesteKnapp')
                .waitForElementVisible('@minIdPinKodeFelt')
                .setValue('@minIdPinKodeFelt', '12345')
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

        setBankIdInputValue(inputElement, inputValue) {
            const self = this;
            const shadowDom = this.api.options.desiredCapabilities.browserName.toLowerCase() === 'chrome' ? '.full_width_height::shadow ' : '';
            return this.getAttribute(inputElement, 'id', (result) => {
                self.setValue(`${shadowDom}#${result.value}`, inputValue + this.api.Keys.ENTER)
                    .waitForElementNotPresent(`${shadowDom}#${result.value}`)
            })
        },

        switchFrame(frame) {
            return this.api.frame(frame).page.IdPortenPage();
        }
    }]
};
