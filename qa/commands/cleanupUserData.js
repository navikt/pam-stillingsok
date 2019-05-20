exports.command = function () {
    const favouritPage = this.page.FavoritterPage();
    const savedSearchesPage = this.page.LagredeSokPage();

    favouritPage.click('@goToFavourites')
        .waitForElementPresent('@favouritesContent', 20000)
        .deleteAllFavourites();

    savedSearchesPage.click('@gotoSavedSearches')
        .waitForElementPresent('@savedSearchesContent', 20000)
        .deleteAllItems();

    return this;
};
