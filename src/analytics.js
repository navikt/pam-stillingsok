import { takeEvery } from 'redux-saga/es/effects';
import { ADD_TO_FAVOURITES_SUCCESS, REMOVE_FROM_FAVOURITES_SUCCESS } from './favourites/favouritesReducer';
import { ADD_SAVED_SEARCH_SUCCESS } from './savedSearches/savedSearchesReducer';
import { SET_SEARCH_STRING } from './search/searchQueryReducer';
import { SEARCH } from './search/searchReducer';

const ignoreFurther = [];

function analytics(...props) {
    if (window.ga) {
        window.ga(...props);
    }
}

function once(...props) {
    const key = props.join();
    if(!ignoreFurther.includes(key)) {
        ignoreFurther.push(key);
        analytics(props);
    }
}

function trackAddToFavouritesSuccess() {
    analytics('send', 'event', 'Favoritter', 'La til favoritt');
}

function trackRemoveFromFavouritesSuccess() {
    analytics('send', 'event', 'Favoritter', 'Slettet favoritt');
}

function trackAddSavedSearchSuccess(action) {
    analytics('send', 'event', 'Lagrede søk', 'La til lagret søk');
}

function trackFirstSearch() {
    once('send', 'event', 'Ledige stillinger', 'Utførte første søk');
}

function trackFirstInteractionWithSearchBox() {
    once('send', 'event', 'Ledige stillinger', 'Endret fritekst første gang');
}

export const analyticsSaga = function* saga() {
    yield takeEvery(ADD_TO_FAVOURITES_SUCCESS, trackAddToFavouritesSuccess);
    yield takeEvery(REMOVE_FROM_FAVOURITES_SUCCESS, trackRemoveFromFavouritesSuccess);
    yield takeEvery(ADD_SAVED_SEARCH_SUCCESS, trackAddSavedSearchSuccess);
    yield takeEvery(SEARCH, trackFirstSearch);
    yield takeEvery(SET_SEARCH_STRING, trackFirstInteractionWithSearchBox);
};
