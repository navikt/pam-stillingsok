const { client } = require('nightwatch-cucumber');
const { Before, After, Given, When, Then } = require('cucumber');

const forside = client.page.SokForside();
const favouritePage = client.page.FavoritterPage();
const savedSearchesPage = client.page.LagredeSokPage();

const brukernavn = process.env['QA_TEST_USERID'] ? process.env['QA_TEST_USERID'] : undefined;

const savedFavourite = {
    title: undefined,
    elementId: undefined
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

Given(/^at jeg er logget inn$/, () => {
    return client.loggInn(brukernavn)
        .cleanupUserData();
});

When(/^jeg lagrer første annonse som favoritt$/,async () => {
    await forside.getFirstAdTitle(savedFavourite);
    await forside.saveFavourite() // Lagre navnet på annonsen som blir favoritt
        .giSamtykke();
});

When(/^jeg går til favoritter i menyen$/, () => {
    return forside.goToFavourites();
});

Then(/^skal annonsen vises i favorittlisten$/, () => {
    return favouritePage.favouritesListContainsTitle(savedFavourite.title);
});

When(/^jeg sletter favoritten$/, () => {
    return favouritePage.deleteFavourite();
});

Then(/^skal ikke annonsen vises i favorittlisten$/, () => {
    return favouritePage.verifyFavouriteDeleted(savedFavourite.title);
});

When(/^jeg lagrer søket som "(.*)"$/, (name) => {
    return forside.saveSearch(name);
});

When(/^jeg går til lagrede søk i menyen$/, () => {
    return forside.gotoSavedSearches();
});

Then(/^skal "(.*)" vises i listen$/, (name) => {
    return savedSearchesPage.savedSearchListContainsName(name);
});

When(/^jeg sletter søket$/, () => {
    return savedSearchesPage.deleteSavedSearch();
});

Then(/^skal "(.*)" ikke vises i listen$/, (name) => {
    return savedSearchesPage.verifySavedSearchesDeleted(name);
});
