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
                .element(`//a[contains(text(),'${name}')]`)
                .to.be.present.before(2000);
            this.api.useCss();
            return this;
        },

        getSavedSearchListItem(savedSearch, navn) {
            const tmp = savedSearch;
            const self = this;

            self.api.elements('css selector', '.SavedSearchListItem', (searches) => {
                searches.value.forEach((search) => {
                    self.api.elementIdElement(search.ELEMENT, 'xpath', `//a[contains(text(),'${navn}')]`, (tittel) => {
                        // Lagre element-ID'en til alle søk som har det gitte navnet
                        if (tittel.value) {
                            tmp.itemElementIds.push(search.ELEMENT);
                        }
                    });
                });
            });

            return this;
        },

        deleteSavedSearches(ids) {
            const self = this;
            ids.forEach((id) => {
                self.api.elementIdElement(id, 'css selector', 'button[class*="Delete"]', (knapp) => {
                    // Klikk slett-knappen
                    self.api.elementIdClick(knapp.value.ELEMENT);
                    // bekreft sletting
                    self.waitForElementPresent('@confirmDeleteButton', 20000)
                        .click('@confirmDeleteButton');
                });
            });
            return this;
        },

        verifySavedSearchesDeleted(navn) {
            this.api.useXpath();
            this.expect
                .element(`//a[contains(text(),'${navn}')]`)
                .to.not.be.present;
            this.api.useCss();
            return this;
        }

    }]
};
