module.exports = {
    elements : {
        searchTextField:'input[id=search-form-fritekst-input]',
        searchResult:'section[id=sokeresultat]',
        noResult:'div[class=NoResults]',
        searchResultItem:'a[class=SearchResultItem]',
        searchResultCount:'div[class=SearchResultsCount]',
    },

    commands : [{
        doTextSearch : function(text) {
            return this.setValue('@searchTextField', text + this.api.Keys.ENTER);
        },

        searchResultContainsWord: function(word) {
            return this.expect.element('@searchResult').text.to.contain(word).before(2000);
        },

        verifyFilterCount: function(filter){
            const page = this;
            page.getText('@searchResultCount', function(result){
                const antallTreff = result.value.replace(/\D+/g,'');
                page.getText(getFilterLabel(filter), function(result){
                    const fasettAntall = result.value.replace(/\D+/g,'');
                    return page.assert.equal(antallTreff,fasettAntall);
                });
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