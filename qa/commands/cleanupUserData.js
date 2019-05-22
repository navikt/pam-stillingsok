exports.command = function () {
    const favouritPage = this.page.FavoritterPage();
    const savedSearchesPage = this.page.LagredeSokPage();
    const forside = this.page.SokForside();

    favouritPage.click('@goToFavourites')
        .waitForElementPresent('@favouritesContent', 20000)
        .deleteAllFavourites();

    savedSearchesPage.click('@gotoSavedSearches')
        .waitForElementPresent('@savedSearchesContent', 20000)
        .deleteAllItems();

    forside.click('@goToForside')
        .waitForElementPresent('@searchResult', 20000);

    return this;
};
