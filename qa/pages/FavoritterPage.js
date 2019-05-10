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
                .element(`//*[contains(@class, 'SearchResultsItemDetails__title') and contains(text(),'${title}')]`)
                .to.be.present.before(2000);
            this.api.useCss();
            return this;
        },

        getFavorittListItem(lagretFavoritt) {
            const tmp = lagretFavoritt;
            const self = this;

            self.api.elements('css selector', '.FavouriteListItem', (favoritter) => {
                favoritter.value.forEach((favoritt) => {
                    self.api.elementIdElement(favoritt.ELEMENT,
                        'xpath',
                        `//*[contains(@class, 'SearchResultsItemDetails__title') and contains(text(),'${lagretFavoritt.tittel}')]`,
                        (element) => {
                            if (element.value) {
                                tmp.itemElementId = favoritt.ELEMENT;
                            }
                        });
                });
            });

            return this;
        },

        deleteFavourite(lagretFavoritt) {
            const self = this;
            self.api.elementIdElement(lagretFavoritt.itemElementId, 'css selector','button[class*="FavouriteListItem__delete"]', (knapp) => {
                // Klikk slett favoritt-knappen
                self.api.elementIdClick(knapp.value.ELEMENT);
                // bekreft sletting
                self.waitForElementPresent('@confirmDeleteButton', 20000)
                    .click('@confirmDeleteButton');
            });

            return this;
        },

        verifyFavouriteDeleted(title) {
            this.api.useXpath();
            this.expect
                .element(`//*[contains(@class, 'SearchResultsItemDetails__title') and contains(text(),'${title}')]`)
                .to.not.be.present;
            this.api.useCss();
            return this;
        }

    }]
};
