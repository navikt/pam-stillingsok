module.exports = {
    elements: {
        goToFavourites: 'a[href="/stillinger/favoritter"]',
        favouritesContent: '.Favourites__main',
        searchResultTitle: '.SearchResultsItemDetails__title',
        deleteFavouriteButton: 'button[class*="FavouriteListItem__delete"]',
        favouriteItem: '.FavouriteListItem',
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
                    self.api.elementIdElement(favoritt.ELEMENT, 'css selector','.SearchResultsItemDetails__title', (tittel) => {
                        self.api.elementIdText(tittel.value.ELEMENT, (tekst) => {
                            if (tekst.value && tekst.value.includes(lagretFavoritt.tittel)) {
                                // Lagre element-ID'en til elementet som har en tittel som matcher input-tittelen
                                tmp.itemElementId = favoritt.ELEMENT;
                            }
                        });
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
