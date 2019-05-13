function getSavedFavouriteTitleElement(title) {
    return `//*[contains(@class, 'SearchResultsItemDetails__title') and contains(text(),'${title}')]`;
}

module.exports = {
    elements: {
        goToFavourites: 'a[href="/stillinger/favoritter"]',
        favouritesContent: '.Favourites__main',
        searchResultTitle: '.SearchResultsItemDetails__title',
        confirmDeleteButton: '.Knapp--hoved'
    },

    commands: [{
        favouritesListContainsTitle(title) {
            this.api.useXpath();
            this.expect
                .element(getSavedFavouriteTitleElement(title))
                .to.be.present.before(2000);
            this.api.useCss();
            return this;
        },

        deleteFavourite() {
            const self = this;
            self.api.element('css selector', 'button[class*="FavouriteListItem__delete"]', (knapp) => {
                // Klikk slett favoritt-knappen
                self.api.elementIdClick(knapp.value.ELEMENT);
                // bekreft sletting
                self.waitForElementPresent('@confirmDeleteButton', 20000)
                    .click('@confirmDeleteButton');
            });
            return this;
        },

        deleteAllFavourites() {
            const self = this;
            self.api.elements('css selector', 'button[class*="FavouriteListItem__delete"]', (knapper) => {
                knapper.value.forEach((knapp) => {
                    // Klikk slett favoritt-knappen
                    self.api.elementIdClick(knapp.ELEMENT);
                    // bekreft sletting
                    self.waitForElementPresent('@confirmDeleteButton', 20000)
                        .click('@confirmDeleteButton');
                });
            });
            return this;
        },

        verifyFavouriteDeleted(title) {
            this.api.useXpath();
            this.expect
                .element(getSavedFavouriteTitleElement(title))
                .to.not.be.present;
            this.api.useCss();
            return this;
        }

    }]
};
