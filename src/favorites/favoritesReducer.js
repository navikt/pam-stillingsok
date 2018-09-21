/* eslint-disable no-underscore-dangle */
import { select, put, call, takeLatest } from 'redux-saga/effects';
import { get, post, remove, SearchApiError } from '../api/api';
import { AD_USER_API } from '../fasitProperties';

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
    isFetchingFavorites: false,
    shouldFetchFavorites: true,
    favorites: [],
    confirmationVisible: false,
    favoriteAboutToBeRemoved: undefined,
    showAlertStripe: false,
    error: undefined,
    alertStripeMode: 'added',
    totalElements: 0,
    favoriteAdUuidList: []
};

export const USER_UUID_HACK = 'bdd00121-9dfb-46b5-82e6-872e2d51f782';

export default function favoritesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_FAVORITES:
            return {
                ...state,
                showAlertStripe: false,
                error: undefined
            };
        case FETCH_FAVORITES_BEGIN:
            return {
                ...state,
                isFetchingFavorites: true,
                favoriteAdUuidList: [...state.favoriteAdUuidList, action.uuid]
            };
        case FETCH_FAVORITES_SUCCESS:
            return {
                ...state,
                favorites: action.response.content,
                favoriteAdUuidList: action.response.content.map((favorite) => (favorite.favouriteAd.uuid)),
                totalElements: action.response.totalElements,
                isFetchingFavorites: false,
                shouldFetchFavorites: false
            };
        case FETCH_FAVORITES_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                isFetchingFavorites: false
            };
        case ADD_TO_FAVORITES_BEGIN:
            return {
                ...state,
                favoriteAdUuidList: [...state.favoriteAdUuidList, action.uuid],
                totalElements: state.totalElements + 1
            };
        case ADD_TO_FAVORITES_SUCCESS:
            return {
                ...state,
                favorites: [...state.favorites, action.response]
            };
        case REMOVE_FROM_FAVORITES_BEGIN:
            return {
                ...state,
                favorites: state.favorites.filter((favorite) => favorite.uuid !== action.uuid),
                favoriteAdUuidList: state.favoriteAdUuidList.filter((uuid) => uuid !== action.uuid),
                totalElements: state.totalElements - 1
            };
        case ADD_TO_FAVORITES_FAILURE:
            return {
                ...state,
                error: 'add_error',
                showAlertStripe: false
            };
        case REMOVE_FROM_FAVORITES_FAILURE:
            return {
                ...state,
                error: 'remove_error',
                showAlertStripe: false
            };
        case SHOW_MODAL_REMOVE_FROM_FAVORITES:
            return {
                ...state,
                showAlertStripe: false,
                confirmationVisible: true,
                favoriteAboutToBeRemoved: state.favorites.find((favorite) => favorite.uuid === action.uuid)
            };
        case HIDE_MODAL_REMOVE_FROM_FAVORITES:
            return {
                ...state,
                confirmationVisible: false,
                favoriteAboutToBeRemoved: undefined
            };
        case SHOW_FAVORITES_ALERT_STRIPE:
            return {
                ...state,
                alertStripeMode: action.alertStripeMode,
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
        userUuid: USER_UUID_HACK,
        favouriteAd: {
            uuid,
            title: ad.title,
            updated: '2018-11-04T10:11:30', //ikke kompatibel med updated fra search
            jobTitle: ad.properties.jobtitle,
            status: 'ACTIVE',
            applicationdue: '2018-11-04T10:11:30' //må være sting i backend
            //location mangler
            //employer mangler
        }
    };
}

function* fetchFavorites() {
    const state = yield select();

    if (state.favorites.shouldFetchFavorites) {
        yield put({ type: FETCH_FAVORITES_BEGIN });
        try {
            const response = yield call(get, `${AD_USER_API}/api/v1/userfavouriteads?size=200&user=${USER_UUID_HACK}`);
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
        yield put({ type: SHOW_FAVORITES_ALERT_STRIPE, alertStripeMode: 'added' });
        yield put({ type: ADD_TO_FAVORITES_BEGIN, uuid: favorite.favouriteAd.uuid });
        const response = yield call(post, `${AD_USER_API}/api/v1/userfavouriteads?user=${USER_UUID_HACK}`, favorite);
        yield put({ type: ADD_TO_FAVORITES_SUCCESS, response });
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
        yield put({ type: SHOW_FAVORITES_ALERT_STRIPE, alertStripeMode: 'removed' });
        yield put({ type: REMOVE_FROM_FAVORITES_BEGIN, uuid: action.uuid });
        yield call(remove, `${AD_USER_API}/api/v1/userfavouriteads/${action.uuid}?user=${USER_UUID_HACK}`);
        yield put({ type: REMOVE_FROM_FAVORITES_SUCCESS });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVORITES_ALERT_STRIPE });
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
