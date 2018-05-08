module.exports = {
    elements : {
        searchTextField:'input[id=search-form-fritekst-input]',
        searchButton:'button[id=search-button]',
        searchResult:'section[id=sokeresultat]',
        noResult:'div[id=no-results]',
        searchResultItem:'a[class=search-result-item-link]',
        searchResultCount:'div[id=search-result-count]',
    },

    commands : [{
        doTextSearch : function(text) {
            return this.setValue('@searchTextField', text)
                .click('@searchButton');
        },

        searchResultContainsWord: function(word) {
            return this.assert.containsText('@searchResult',word);
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