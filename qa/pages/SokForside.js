module.exports = {
    elements : {
        searchTextField:'input[id=search-form-fritekst-input]',
        searchResult:'#treff',
        noResult:'.NoResults',
        searchResultItem:'.SearchResultItem',
        searchResultItemLink: {
            selector: '//*[@id="treff"]/div[2]/div/div[1]/a',
            locateStrategy: 'xpath'
        },
        searchResultCount:'.SearchResultCount',
        searchResultCountMobile: '.ShowResultsButton__flex__count',
        searchResultLocation: '.SearchResultsItemDetails__location'
    },

    commands : [{
        pagePause: function(ms) {
            return this.api.pause(ms).page.SokForside();
        },

        doTextSearch : function(text) {
            return this.setValue('@searchTextField', text + this.api.Keys.ENTER);
        },

        searchResultContainsWord: function(word) {
            return this.pagePause(2000).expect.element('@searchResult').text.to.contain(word);
        },

        searchResultContainsLocation: function(sted) {
            return this.pagePause(2000).getText('@searchResultLocation', function(result) {
                this.assert.equal(result.value, sted);
            });
        },

        verifyFilterCount: function(filter){
            const page = this;
            const extractResultCount = (resultCountText) => {
                const matchResult = /(\d+) annonse/.exec(resultCountText);
                return matchResult ? matchResult[1] : '';
            }

            return page.isVisible('@searchResultCount', function(result) {
                if (result.value) {
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
                    page.api.elements('css selector', getLukketEkspanderbartPanel(), function(result) {;
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
        }
    }]
};

function getFilterLabel(filter){
    return 'input[type=checkbox][value='+filter+'] + label';
}

function getLukketEkspanderbartPanel(){
    return 'div[class*="ekspanderbartPanel--lukket"]';
}
