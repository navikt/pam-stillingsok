import { select, put, call, takeLatest } from 'redux-saga/effects';
import { SearchApiError } from '../api/api';

export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const FETCH_FAVORITES_BEGIN = 'FETCH_FAVORITES_BEGIN';
export const FETCH_FAVORITES_SUCCESS = 'FETCH_FAVORITES_SUCCESS';
export const FETCH_FAVORITES_FAILURE = 'FETCH_FAVORITES_FAILURE';

export const FETCH_FAVORITE_ADS = 'FETCH_FAVORITE_ADS';
export const FETCH_FAVORITE_ADS_BEGIN = 'FETCH_FAVORITE_ADS_BEGIN';
export const FETCH_FAVORITE_ADS_SUCCESS = 'FETCH_FAVORITE_ADS_SUCCESS';
export const FETCH_FAVORITE_ADS_FAILURE = 'FETCH_FAVORITE_ADS_FAILURE';

export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const ADD_TO_FAVORITES_SUCCESS = 'ADD_TO_FAVORITES_SUCCESS';
export const ADD_TO_FAVORITES_FAILURE = 'ADD_TO_FAVORITES_FAILURE';

export const SHOW_MODAL_REMOVE_FROM_FAVORITES = 'ABOUT_TO_REMOVE_FROM_FAVORITES';
export const HIDE_MODAL_REMOVE_FROM_FAVORITES = 'CONFIRM_REMOVE_FROM_FAVORITES';
export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const REMOVE_FROM_FAVORITES_SUCCESS = 'REMOVE_FROM_FAVORITES_SUCCESS';
export const REMOVE_FROM_FAVORITES_FAILURE = 'REMOVE_FROM_FAVORITES_FAILURE';

export const SHOW_FAVORITES_ALERT_STRIPE = 'SHOW_FAVORITES_ALERT_STRIPE';
export const HIDE_FAVORITES_ALERT_STRIPE = 'HIDE_FAVORITES_ALERT_STRIPE';

const initialState = {
    favorites: [],
    favoriteAds: [],
    confirmationVisible: false,
    adAboutToBeRemoved: undefined,
    showAlertStripe: false
};

export default function favoritesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_FAVORITES_SUCCESS:
            return {
                ...state,
                favorites: action.favorites
            };
        case FETCH_FAVORITE_ADS_SUCCESS:
            return {
                ...state,
                favoriteAds: action.favoriteAds
            };
        case ADD_TO_FAVORITES:
            return {
                ...state,
                favorites: [...state.favorites, action.uuid]
            };
        case REMOVE_FROM_FAVORITES:
            return {
                ...state,
                favorites: state.favorites.filter((uuid) => uuid !== action.uuid),
                favoriteAds: state.favoriteAds.filter((ad) => ad.uuid !== action.uuid)
            };
        case SHOW_MODAL_REMOVE_FROM_FAVORITES:
            return {
                ...state,
                confirmationVisible: true,
                adAboutToBeRemoved: state.favoriteAds.find((ad) => ad.uuid === action.uuid)
            };
        case HIDE_MODAL_REMOVE_FROM_FAVORITES:
            return {
                ...state,
                confirmationVisible: false,
                adAboutToBeRemoved: undefined
            };
        case SHOW_FAVORITES_ALERT_STRIPE:
            return {
                ...state,
                showAlertStripe: true
            };
        case HIDE_FAVORITES_ALERT_STRIPE:
            return {
                ...state,
                showAlertStripe: false
            };
        default:
            return state;
    }
}

function* fetchFavorites() {
    try {
        yield put({ type: FETCH_FAVORITES_BEGIN });
        const favoritesString = localStorage.getItem('favorites');
        const favorites = favoritesString !== null ? JSON.parse(favoritesString) : [];
        yield put({ type: FETCH_FAVORITES_SUCCESS, favorites });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_FAVORITES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* fetchFavoriteAds() {
    try {
        yield put({ type: FETCH_FAVORITE_ADS_BEGIN });
        const favoriteAdsString = localStorage.getItem('favoriteAds');
        const favoriteAds = favoriteAdsString !== null ? JSON.parse(favoriteAdsString) : [];
        yield put({ type: FETCH_FAVORITE_ADS_SUCCESS, favoriteAds });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_FAVORITE_ADS_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

function* addToFavorites(action) {
    try {
        const state = yield select();
        const favoritesString = localStorage.getItem('favorites');
        const favoritesOld = favoritesString !== null ? JSON.parse(favoritesString) : [];
        const favorites = [...favoritesOld, action.uuid];
        localStorage.setItem('favorites', JSON.stringify(favorites));

        let found = state.search.searchResult.stillinger &&
            state.search.searchResult.stillinger.find((s) => s.uuid === action.uuid);
        let data;

        if (found) {
            data = {
                uuid: found.uuid,
                title: found.title,
                updated: found.updated,
                properties: {
                    employer: found.properties.employer,
                    jobtitle: found.properties.jobtitle,
                    location: found.properties.location,
                    updated: found.properties.updated,
                    applicationdue: found.properties.applicationdue
                }
            };
        } else {
            found = state.stilling.stilling;
            data = {
                uuid: found._id,
                title: found._source.title,
                updated: found._source.updated,
                properties: {
                    employer: found._source.properties.employer,
                    jobtitle: found._source.properties.jobtitle,
                    location: found._source.properties.location,
                    updated: found._source.properties.updated,
                    applicationdue: found._source.properties.applicationdue
                }
            };
        }

        const favoriteAdsString = localStorage.getItem('favoriteAds');
        const favoriteAdsOld = favoriteAdsString !== null ? JSON.parse(favoriteAdsString) : [];
        const favoriteAds = [...favoriteAdsOld, data];
        localStorage.setItem('favoriteAds', JSON.stringify(favoriteAds));

        yield put({ type: ADD_TO_FAVORITES_SUCCESS, favorites });

        yield put({ type: SHOW_FAVORITES_ALERT_STRIPE });

        yield call(delay, 5000);
        yield put({ type: HIDE_FAVORITES_ALERT_STRIPE });


    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ADD_TO_FAVORITES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* removeFromFavorites(action) {
    try {
        const favoritesString = localStorage.getItem('favorites');
        const favoritesOld = favoritesString !== null ? JSON.parse(favoritesString) : [];
        const favorites = favoritesOld.filter((uuid) => uuid !== action.uuid);
        localStorage.setItem('favorites', JSON.stringify(favorites));

        const favoriteAdsString = localStorage.getItem('favoriteAds');
        const favoriteAdsOld = favoriteAdsString !== null ? JSON.parse(favoriteAdsString) : [];
        const favoriteAds = favoriteAdsOld.filter((ad) => ad.uuid !== action.uuid);
        localStorage.setItem('favoriteAds', JSON.stringify(favoriteAds));

        yield put({ type: REMOVE_FROM_FAVORITES_SUCCESS, favorites, favoriteAds });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: REMOVE_FROM_FAVORITES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const favoritesSaga = function* saga() {
    yield takeLatest(FETCH_FAVORITES, fetchFavorites);
    yield takeLatest(FETCH_FAVORITE_ADS, fetchFavoriteAds);
    yield takeLatest(ADD_TO_FAVORITES, addToFavorites);
    yield takeLatest(REMOVE_FROM_FAVORITES, removeFromFavorites);
};
