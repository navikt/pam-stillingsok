import { takeLatest, takeEvery } from 'redux-saga/es/effects';
import { ADD_TO_FAVOURITES_SUCCESS, REMOVE_FROM_FAVOURITES_SUCCESS } from './favourites/favouritesReducer';
import { ADD_SAVED_SEARCH_SUCCESS } from './savedSearches/savedSearchesReducer';
import { SEARCH } from './search/searchReducer';

let igonreFutherEvents = false;

function analytics(...props) {
    console.log(JSON.stringify(props))
    if (window.ga) {
        window.ga(...props);
    }
}

function trackAddToFavouritesSuccess() {
    analytics('send', 'event', 'Favoritter', 'Legg til favoritt');
}

function trackRemoveFromFavouritesSuccess() {
    analytics('send', 'event', 'Favoritter', 'Slett favoritt');
}

function trackAddSavedSearchSuccess(action) {
    analytics('send', 'event', 'Lagrede søk', 'Legg til lagret søk');
}

function trackFirstSearch() {
    if(!igonreFutherEvents) {
        analytics('send', 'event', 'Ledige stillinger', 'Utført minst et søk');
        igonreFutherEvents = true;
    }
}

export const analyticsSaga = function* saga() {
    yield takeEvery(ADD_TO_FAVOURITES_SUCCESS, trackAddToFavouritesSuccess);
    yield takeEvery(REMOVE_FROM_FAVOURITES_SUCCESS, trackRemoveFromFavouritesSuccess);
    yield takeEvery(ADD_SAVED_SEARCH_SUCCESS, trackAddSavedSearchSuccess);
    yield takeEvery(SEARCH, trackFirstSearch);
};
