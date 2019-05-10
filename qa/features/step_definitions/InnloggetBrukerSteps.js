const { client } = require('nightwatch-cucumber');
const { Before, After, Given, When, Then } = require('cucumber');

const forside = client.page.SokForside();
const favoritterPage = client.page.FavoritterPage();
const savedSearchesPage = client.page.LagredeSokPage();

const lagretFavoritt = {
    tittel: undefined,
    itemElementId: undefined
};

const savedSearch = {
    itemElementIds: []
};

Before(() => {
    return client.useCss(); // I tilfelle et scenario feiler med XPath, så vil neste scenario bruke CSS, som er default.
});

After(async (scenarioContext) => {
    if (client.sauceEnd) { //  Exists only when running with Saucelabs
        await client.sauceEnd(scenarioContext);
    } else {
        client.end();
    }
});

Given(/^at jeg er logget inn som "(.*)"$/, (brukernavn) => {
    return client.loggInn(brukernavn, 'MinID');
});

When(/^jeg lagrer første annonse som favoritt$/, () => {
    return forside.getFirstAdTitle(lagretFavoritt)
        .lagreFavoritt() // Lagre navnet på annonsen som blir favoritt
        .giSamtykke();
});

When(/^jeg går til favoritter i menyen$/, () => {
    return forside.gaTilFavoritter();
});

Then(/^skal annonsen vises i favorittlisten$/, () => {
    return favoritterPage.getFavorittListItem(lagretFavoritt)
        .favouritesListContainsTitle(lagretFavoritt.tittel);
});

When(/^jeg sletter favoritten$/, () => {
    return favoritterPage.deleteFavourite(lagretFavoritt);
});

Then(/^skal ikke annonsen vises i favorittlisten$/, () => {
    return favoritterPage.verifyFavouriteDeleted(lagretFavoritt.tittel);
});

When(/^jeg lagrer søket som "(.*)"$/, (name) => {
    return forside.saveSearch(name);
});


When(/^jeg går til lagrede søk i menyen$/, () => {
    return forside.gotoSavedSearches();
});

Then(/^skal "(.*)" vises i listen$/, (name) => {
    return savedSearchesPage.getSavedSearchListItem(savedSearch, name)
        .savedSearchListContainsName(name);
});

When(/^jeg sletter søket$/, () => {
    return savedSearchesPage.deleteSavedSearches(savedSearch.itemElementIds);

});

Then(/^skal "(.*)" ikke vises i listen$/, (name) => {
    return savedSearchesPage.verifySavedSearchesDeleted(name);
});
