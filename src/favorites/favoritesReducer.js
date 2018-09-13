import { select, put, call, takeLatest } from 'redux-saga/effects';
import { SearchApiError } from '../api/api';
import { get, post, remove } from './mockapi';
import { SEARCH_API } from '../fasitProperties';

export const FETCH_FAVORITES = 'FETCH_FAVORITES';
export const FETCH_FAVORITES_BEGIN = 'FETCH_FAVORITES_BEGIN';
export const FETCH_FAVORITES_SUCCESS = 'FETCH_FAVORITES_SUCCESS';
export const FETCH_FAVORITES_FAILURE = 'FETCH_FAVORITES_FAILURE';

export const ADD_TO_FAVORITES = 'ADD_TO_FAVORITES';
export const ADD_TO_FAVORITES_BEGIN = 'ADD_TO_FAVORITES_BEGIN';
export const ADD_TO_FAVORITES_SUCCESS = 'ADD_TO_FAVORITES_SUCCESS';
export const ADD_TO_FAVORITES_FAILURE = 'ADD_TO_FAVORITES_FAILURE';

export const SHOW_MODAL_REMOVE_FROM_FAVORITES = 'ABOUT_TO_REMOVE_FROM_FAVORITES';
export const HIDE_MODAL_REMOVE_FROM_FAVORITES = 'CONFIRM_REMOVE_FROM_FAVORITES';

export const REMOVE_FROM_FAVORITES = 'REMOVE_FROM_FAVORITES';
export const REMOVE_FROM_FAVORITES_BEGIN = 'REMOVE_FROM_FAVORITES_BEGIN';
export const REMOVE_FROM_FAVORITES_SUCCESS = 'REMOVE_FROM_FAVORITES_SUCCESS';
export const REMOVE_FROM_FAVORITES_FAILURE = 'REMOVE_FROM_FAVORITES_FAILURE';

export const SHOW_FAVORITES_ALERT_STRIPE = 'SHOW_FAVORITES_ALERT_STRIPE';
export const HIDE_FAVORITES_ALERT_STRIPE = 'HIDE_FAVORITES_ALERT_STRIPE';

const initialState = {
    shouldFetchFavorites: true,
    favorites: [],
    confirmationVisible: false,
    adAboutToBeRemoved: undefined,
    showAlertStripe: false,
    error: undefined
};

export default function favoritesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_FAVORITES_BEGIN:
            return {
                ...state,
                error: undefined
            };
        case FETCH_FAVORITES_SUCCESS:
            return {
                ...state,
                favorites: action.response,
                shouldFetchFavorites: false
            };
        case ADD_TO_FAVORITES_BEGIN:
            return {
                ...state,
                favorites: [...state.favorites, action.favorite]
            };
        case REMOVE_FROM_FAVORITES_BEGIN:
            return {
                ...state,
                favorites: state.favorites.filter((favorite) => favorite.uuid !== action.uuid)
            };
        case ADD_TO_FAVORITES_FAILURE:
        case REMOVE_FROM_FAVORITES_FAILURE:
            return {
                ...state,
                error: action.error
            };
        case SHOW_MODAL_REMOVE_FROM_FAVORITES:
            return {
                ...state,
                confirmationVisible: true,
                adAboutToBeRemoved: state.favorites.find((favorite) => favorite.uuid === action.uuid)
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toFavorite(uuid, ad) {
    return {
        uuid,
        title: ad.title,
        updated: ad.updated,
        properties: {
            employer: ad.properties.employer,
            jobtitle: ad.properties.jobtitle,
            location: ad.properties.location,
            updated: ad.properties.updated,
            applicationdue: ad.properties.applicationdue
        }
    };
}

function* fetchFavorites() {
    const state = yield select();
    if (state.favorites.shouldFetchFavorites) {
        try {
            yield put({ type: FETCH_FAVORITES_BEGIN });
            const response = yield call(get, `${SEARCH_API}/favorites`);
            yield put({ type: FETCH_FAVORITES_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_FAVORITES_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* addToFavorites(action) {
    try {
        let favorite;
        const state = yield select();
        const foundInSearchResult = state.search.searchResult.stillinger &&
            state.search.searchResult.stillinger.find((s) => s.uuid === action.uuid);

        if (foundInSearchResult) {
            favorite = toFavorite(foundInSearchResult.uuid, foundInSearchResult);
        } else if (state.stilling.stilling._id === action.uuid) {
            favorite = toFavorite(state.stilling.stilling._id, state.stilling.stilling._source);
        } else {
            return;
        }
        yield put({ type: ADD_TO_FAVORITES_BEGIN, favorite });
        const response = yield call(post, `${SEARCH_API}/favorites`, favorite);
        yield put({ type: ADD_TO_FAVORITES_SUCCESS, response });

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
        yield put({ type: REMOVE_FROM_FAVORITES_BEGIN, uuid: action.uuid });
        const response = yield call(remove, action.uuid);
        yield put({ type: REMOVE_FROM_FAVORITES_SUCCESS, response });
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
    yield takeLatest(ADD_TO_FAVORITES, addToFavorites);
    yield takeLatest(REMOVE_FROM_FAVORITES, removeFromFavorites);
};
