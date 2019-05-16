module.exports = {
    elements: {
        goToForside: 'a[href="/stillinger"]',
        searchTextField: 'input[id=search-form-fritekst-input]',
        searchResult: '#treff',
        noResult: '.NoResults',
        searchResultItem: '.SearchResultItem',
        searchResultItemLink: {
            selector: '//*[@id="treff"]/div[2]/div/div[1]/a',
            locateStrategy: 'xpath'
        },
        searchResultCount: '.SearchResultCount__h3__count',
        searchResultCountMobile: '.ShowResultsButton__flex__count',
        searchResultTitle: '.SearchResultsItemDetails__title',
        searchResultLocation: '.SearchResultsItemDetails__location',
        toggleFavoriteButton: 'button[class*="ToggleFavouriteStar"][aria-pressed="false"]',
        loggInnButton: 'button[class*="Header__Button"]',
        loggInnPersonButton: 'button[aria-label="Logg inn som jobbsøker"]',
        samtykkeCheckbox: 'input[id=TermsOfUse__checkbox]',
        samtykkeButton: 'button[id=TermsOfUse__acceptButton]',
        samtykkeEpost: 'input[id=TermsOfUse__email]',
        saveSearchButton: '.SaveSearchButton',
        savedSearchName: 'input[id=SavedSearchModal__name]',
        confirmSaveSearchButton: 'button[id=SavedSearchModal__saveButton]'
    },

    commands: [{
        pagePause: function(ms) {
            return this.api.pause(ms).page.SokForside();
        },

        doTextSearch : function(text) {
            return this.setValue('@searchTextField', text + this.api.Keys.ENTER);
        },

        searchResultContainsWord: function(word) {
            const regexpVal = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            return this.pagePause(2000).expect.element('@searchResult').text.to.match(new RegExp(regexpVal, 'i'));
        },

        searchResultContainsLocation: function(sted) {
            return this.pagePause(2000).getText('@searchResultLocation', function(result) {
                this.assert.equal(result.value.toLowerCase().includes(sted.toLowerCase()), true);
            });
        },

        verifyFilterCount: function(filter){
            const page = this;
            const extractResultCount = (resultCountText) => {
                const matchResult = /(\d+) annonse/.exec(resultCountText);
                return matchResult ? matchResult[1] : '';
            };

            return page.isVisible('@searchResultCount', function(result) {
                if (result.status === 0) {
                    page.getText('@searchResultCount', function(result) {
                        const resultCount = extractResultCount(result.value);
                        page.getText(getFilterLabel(filter), function(result) {
                            const facetCount = result.value.replace(/\D+/g,'');
                            page.assert.equal(resultCount,facetCount);
                        });
                    });
                } else {
                    // try mobile view
                    page.getText('@searchResultCountMobile', function(result) {
                        const resultCount = extractResultCount(result.value);
                        page.getText(getFilterLabel(filter), function(result) {
                            const facetCount = result.value.replace(/\D+/g,'');
                            page.assert.equal(resultCount,facetCount);
                        });
                    });
                }
            });
        },


        showFilterElement: function(filter){
            const page = this;
            page.api.pause(1000).element('css selector', this.getFilterCheckbox(filter), function(result) {
                if(result.status === -1){ // is not visible;
                    page.api.elements('css selector', getLukketEkspanderbartPanel(), function(result) {
                        result.value.forEach(function(element) {
                            page.api.elementIdClick(element.ELEMENT).pause(1000);
                        })
                    });
                }
            });
            return this;
        },

        getFilterCheckbox: function(filter){
            return 'input[type=checkbox][value='+filter+']';
        },

        getFirstAdTitle(lagretFavoritt) {
            const tmp = lagretFavoritt;
            this.waitForElementPresent('@searchResultTitle', 20000)
                .getText('@searchResultTitle', (result) => {
                    tmp.title = result.value;
                });
            return this;
        },

        saveFavourite() {
            // Klikk favorittstjerne på første annonse som ikke er favoritt
            return this.waitForElementPresent('@toggleFavoriteButton', 20000)
                .click('@toggleFavoriteButton');
        },

        giSamtykke() {
            const self = this;
            // Gi samtykke hvis nødvendig
            this.api.element('css selector', 'div[class*="TermsOfUse"]', (result) => {
                if (result.status !== -1) {
                    // samtykkemodal eksisteren, avgi samtykke
                    self.setValue('@samtykkeCheckbox', self.api.Keys.SPACE)
                        .setValue('@samtykkeEpost', 'test@test.com')
                        .click('@samtykkeButton');
                }
            });
            return this;
        },

        goToFavourites() {
            // Alertstripe blir vist som skjuler favoritter-lenken, så scroll til toppen så man kan
            // trykke på lenken
            this.getLocationInView('@loggInnButton');
            const favoritter = this.api.page.FavoritterPage();
            favoritter.click('@goToFavourites')
                .waitForElementPresent('@favouritesContent', 20000);
            return this;
        },

        saveSearch(name) {
            return this.waitForElementPresent('@saveSearchButton', 20000)
                .click('@saveSearchButton')
                .waitForElementPresent('@savedSearchName', 20000)
                .clearValue('@savedSearchName')
                .setValue('@savedSearchName', name)
                .click('@confirmSaveSearchButton');
        },

        gotoSavedSearches() {
            // Alertstripe blir vist som skjuler lenken, så scroll til toppen så man kan trykke på den
            this.getLocationInView('@loggInnButton');
            const savedSearches = this.api.page.LagredeSokPage();
            savedSearches.click('@gotoSavedSearches')
                .waitForElementPresent('@savedSearchesContent', 20000);
            return this;
        },
    }]
};

function getFilterLabel(filter){
    return 'input[type=checkbox][value='+filter+'] + label';
}

function getLukketEkspanderbartPanel(){
    return 'div[class*="ekspanderbartPanel--lukket"]';
}
