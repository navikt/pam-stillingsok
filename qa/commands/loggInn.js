exports.command = function (brukernavn) {
    const idPortenPage = this.page.IdPortenPage();
    const sokForside = this.page.SokForside();

    this
        .url(this.launch_url)
        .maximizeWindow();

    sokForside.waitForElementPresent('@loggInnButton', 20000);
    sokForside
        .click('@loggInnButton')
        .waitForElementPresent('@loggInnPersonButton')
        .click('@loggInnPersonButton');

    if (this.globals.environment === 'local') {
        sokForside.waitForElementPresent('@searchResult', 20000);
    } else {
        if (this.globals.loginCookie.name) {
            this
                .setCookie(this.globals.loginCookie)
                .execute(`sessionStorage.clear();`) // Fjerner Key preventRedirectToLogin
                .url(this.launch_url);
            sokForside.waitForElementPresent('@searchResult', 20000);
        } else {
            idPortenPage
                .loggInnIdPorten(brukernavn);
        }
    }
};
