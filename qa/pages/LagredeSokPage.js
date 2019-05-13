function getSavedSearchNameElement(name) {
    return `//a[contains(text(),'${name}')]`;
}

module.exports = {
    elements: {
        gotoSavedSearches: 'a[href="/stillinger/lagrede-sok"]',
        savedSearchesContent: '.SavedSearches__main',
        confirmDeleteButton: '.Knapp--hoved'
    },

    commands: [{
        savedSearchListContainsName(name) {
            this.api.useXpath();
            this.expect
                .element(getSavedSearchNameElement(name))
                .to.be.present.before(2000);
            this.api.useCss();
            return this;
        },

        deleteSavedSearch() {
            const self = this;
            self.api.element('css selector', 'button[class*="Delete"]', (knapp) => {
                // Klikk slett-knappen
                self.api.elementIdClick(knapp.value.ELEMENT);
                // bekreft sletting
                self.waitForElementPresent('@confirmDeleteButton', 20000)
                    .click('@confirmDeleteButton');
            });
            return this;
        },

        deleteAllItems() {
            const self = this;
            self.api.elements('css selector', 'button[class*="Delete"]', (knapper) => {
                knapper.value.forEach((knapp) => {
                    // Klikk slett-knappen
                    self.api.elementIdClick(knapp.ELEMENT);
                    // bekreft sletting
                    self.waitForElementPresent('@confirmDeleteButton', 20000)
                        .click('@confirmDeleteButton');
                });
            });
            return this;
        },

        verifySavedSearchesDeleted(name) {
            this.api.useXpath();
            this.expect
                .element(getSavedSearchNameElement(name))
                .to.not.be.present;
            this.api.useCss();
            return this;
        }

    }]
};
