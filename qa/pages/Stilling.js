module.exports = {
    elements : {
        stillingsTekst: 'div[id=stillingstekst]',
        stillingsTittel: 'h1[id=stillingstittel]',
        detaljer: 'div[id=detail-sidebar]'
    },

    commands : [{
        detailSectionContainsText: function(section, text){
            this.api.useXpath();
            this.expect.element(detailSectionElement(section,text)).to.be.present;
            this.api.useCss();
            return this;

        }
    }]
};

function detailSectionElement(section,text){
    return '//h3[contains(text(), "' + section + '")]//following-sibling::dl//dd[contains(text(), "' + text + '")]';
}

