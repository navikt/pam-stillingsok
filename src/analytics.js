import { takeEvery } from 'redux-saga/es/effects';
import { ADD_TO_FAVOURITES_SUCCESS } from './favourites/favouritesReducer';
import { ADD_SAVED_SEARCH_SUCCESS } from './savedSearches/savedSearchesReducer';

function analytics(...props) {
    if (window.ga) {
        window.ga(...props);
    }
}

function trackAddToFavouritesSuccess() {
    analytics('send', 'event', 'Favoritter', 'Legg til favoritt');
}

function trackAddSavedSearchSuccess(action) {
    analytics('send', 'event', 'Lagrede søk', 'Legg til lagret søk');
}



export const analyticsSaga = function* saga() {
    yield takeEvery(ADD_TO_FAVOURITES_SUCCESS, trackAddToFavouritesSuccess);
    yield takeEvery(ADD_SAVED_SEARCH_SUCCESS, trackAddSavedSearchSuccess);
};
