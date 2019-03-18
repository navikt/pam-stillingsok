module.exports = {
    elements : {
        stillingsTekst: '.AdText',
        stillingsTittel: '.StillingsTitle__title',
        detaljer: '.detail-section'
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
    return '//h2[contains(text(), "' + section + '")]//following-sibling::div//dl//dd[contains(text(), "' + text + '")]';
}

