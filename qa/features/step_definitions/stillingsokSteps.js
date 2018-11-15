const { client } = require('nightwatch-cucumber');
const { Before, After, Given, When, Then } = require('cucumber');

const forside = client.page.SokForside();
const stilling = client.page.Stilling();

Before(() => {
    return client.useCss(); // I tilfelle et scenario feiler med XPath, så vil neste scenario bruke CSS, som er default.
});

After(() => {
    client.end();
});

Given(/^at jeg er på forsiden for søk/, async () => {
    await client.url(client.launch_url);
    await forside.waitForElementPresent('@searchResultItem');
});

When(/^jeg søker på "(.*)"$/, (sokeOrd) => {
    return forside.doTextSearch(sokeOrd);
});

Then(/^skal det forekomme minst ett treff der "(.*)" finnes i resultatvisningen$/, (sokeOrd) => {
    return forside.searchResultContainsWord(sokeOrd);
});

Then(/^skal ingen treff vises$/, () => {
    return forside.expect.element('@noResult').to.be.visible;
});

When(/^jeg åpner en stillingsannonse$/, async () => {
    await forside.waitForElementPresent('@searchResultItem');
    await forside.api.pause(1000);
    await forside.click('@searchResultItemLink');
    await stilling.waitForElementPresent('@stillingsTittel');
});

Then(/^skal annonsen ha innhold$/, async () => {
    const nonEmptyStringRegex =/^(?!\s*$).+/;

    await stilling.expect.element('@stillingsTekst').text.to.match(nonEmptyStringRegex);
    await stilling.expect.element('@stillingsTittel').text.to.match(nonEmptyStringRegex);
    await stilling.expect.element('@detaljer').text.to.match(nonEmptyStringRegex);

});

When(/^jeg filtrerer på "(.*)"$/, (filter) => {
    const element = forside.getFilterCheckbox(filter);
    return forside.showFilterElement(filter)
        .setValue(element, forside.api.Keys.SPACE);
});

Then(/^skal "(.*)" vises som sted i annonsetreffene$/, (sted) => {
    return forside.searchResultContainsLocation(sted);
});

Then(/^antall treff skal stemme overens med antall i fasett "(.*)"$/, (filter) => {
    return forside.verifyFilterCount(filter);
});

Then(/^skal "(.*)" vises under "(.*)"$/, (filter, kategori) => {
    return stilling.detailSectionContainsText(kategori, filter);
});
