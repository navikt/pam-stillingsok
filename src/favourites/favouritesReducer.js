/* eslint-disable no-underscore-dangle */
import { call, put, select, take, takeLatest } from 'redux-saga/effects';
import { userApiGet, userApiPost, userApiRemove } from '../api/userApi';
import SearchApiError from '../api/SearchApiError';
import AuthenticationCaller from '../authentication/AuthenticationCaller';
import { requiresAuthentication } from '../authentication/authenticationReducer';
import getWorkLocation from '../common/getWorkLocation';
import getEmployer from '../common/getEmployer';
import {
    FETCH_USER_SUCCESS,
    CREATE_USER_SUCCESS,
    SHOW_TERMS_OF_USE_MODAL,
    HIDE_TERMS_OF_USE_MODAL
} from '../user/userReducer';
import { AD_USER_API } from '../fasitProperties';

export const FETCH_FAVOURITES = 'FETCH_FAVOURITES';
export const FETCH_FAVOURITES_BEGIN = 'FETCH_FAVOURITES_BEGIN';
export const FETCH_FAVOURITES_SUCCESS = 'FETCH_FAVOURITES_SUCCESS';
export const FETCH_FAVOURITES_FAILURE = 'FETCH_FAVOURITES_FAILURE';

export const ADD_TO_FAVOURITES = 'ADD_TO_FAVOURITES';
export const ADD_TO_FAVOURITES_BEGIN = 'ADD_TO_FAVOURITES_BEGIN';
export const ADD_TO_FAVOURITES_SUCCESS = 'ADD_TO_FAVOURITES_SUCCESS';
export const ADD_TO_FAVOURITES_FAILURE = 'ADD_TO_FAVOURITES_FAILURE';

export const SHOW_MODAL_REMOVE_FROM_FAVOURITES = 'ABOUT_TO_REMOVE_FROM_FAVOURITES';
export const HIDE_MODAL_REMOVE_FROM_FAVOURITES = 'CONFIRM_REMOVE_FROM_FAVOURITES';

export const REMOVE_FROM_FAVOURITES = 'REMOVE_FROM_FAVOURITES';
export const REMOVE_FROM_FAVOURITES_BEGIN = 'REMOVE_FROM_FAVOURITES_BEGIN';
export const REMOVE_FROM_FAVOURITES_SUCCESS = 'REMOVE_FROM_FAVOURITES_SUCCESS';
export const REMOVE_FROM_FAVOURITES_FAILURE = 'REMOVE_FROM_FAVOURITES_FAILURE';

export const SHOW_FAVOURITES_ALERT_STRIPE = 'SHOW_FAVOURITES_ALERT_STRIPE';
export const HIDE_FAVOURITES_ALERT_STRIPE = 'HIDE_FAVOURITES_ALERT_STRIPE';

const initialState = {
    isFetchingFavourites: false,
    favourites: [],
    confirmationVisible: false,
    favouriteAboutToBeRemoved: undefined,
    showAlertStripe: false,
    error: undefined,
    alertStripeMode: 'added',
    totalElements: 0,
    adsMarkedAsFavorite: [],
    pending: [],
    favouritesAboutToBeDeleted: []
};

export default function favouritesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_FAVOURITES:
            return {
                ...state,
                showAlertStripe: false,
                error: undefined
            };
        case FETCH_FAVOURITES_BEGIN:
            return {
                ...state,
                isFetchingFavourites: true,
                adsMarkedAsFavorite: [...state.adsMarkedAsFavorite, action.uuid]
            };
        case FETCH_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: action.response.content,
                adsMarkedAsFavorite: action.response.content.map((favourite) => (favourite.favouriteAd.uuid)),
                totalElements: action.response.totalElements,
                isFetchingFavourites: false
            };
        case FETCH_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                isFetchingFavourites: false
            };
        case ADD_TO_FAVOURITES_BEGIN:
            return {
                ...state,
                adsMarkedAsFavorite: [...state.adsMarkedAsFavorite, action.favourite.favouriteAd.uuid]
            };
        case ADD_TO_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: [action.response, ...state.favourites],
                totalElements: state.totalElements + 1
            };
        case ADD_TO_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'add_error',
                adsMarkedAsFavorite: state.adsMarkedAsFavorite.filter((uuid) => uuid !== action.uuid)
            };
        case REMOVE_FROM_FAVOURITES_BEGIN:
            return {
                ...state,
                adsMarkedAsFavorite: state.adsMarkedAsFavorite.filter((uuid) => uuid !== action.favourite.favouriteAd.uuid),
                pending: [...state.pending, action.favourite.uuid]
            };
        case REMOVE_FROM_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: state.favourites.filter((favourite) => favourite.uuid !== action.favourite.uuid),
                totalElements: state.totalElements - 1,
                pending: state.pending.filter((uuid) => uuid !== action.favourite.uuid)
            };
        case REMOVE_FROM_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'remove_error',
                adsMarkedAsFavorite: [...state.adsMarkedAsFavorite, action.favourite.favouriteAd.uuid],
                pending: state.pending.filter((uuid) => uuid !== action.favourite.uuid)
            };
        case SHOW_MODAL_REMOVE_FROM_FAVOURITES:
            return {
                ...state,
                showAlertStripe: false,
                confirmationVisible: true,
                favouriteAboutToBeRemoved: state.favourites.find((favourite) => favourite.uuid === action.uuid)
            };
        case HIDE_MODAL_REMOVE_FROM_FAVOURITES:
            return {
                ...state,
                confirmationVisible: false,
                favouriteAboutToBeRemoved: undefined
            };
        case SHOW_FAVOURITES_ALERT_STRIPE:
            return {
                ...state,
                alertStripeMode: action.alertStripeMode,
                showAlertStripe: true
            };
        case HIDE_FAVOURITES_ALERT_STRIPE:
            return {
                ...state,
                showAlertStripe: false
            };
        default:
            return state;
    }
}

export const withoutPendingFavorites = function withoutPendingFavorites(state) {
    return state.favourites.filter((favourite) => !state.pending.includes(favourite.uuid));
};

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toFavourite(uuid, ad) {
    return {
        favouriteAd: {
            uuid,
            title: ad.title,
            jobTitle: ad.properties.jobtitle ? ad.properties.jobtitle : null,
            status: ad.status,
            applicationdue: ad.properties.applicationdue ? ad.properties.applicationdue : null,
            location: getWorkLocation(ad),
            employer: getEmployer(ad),
            published: ad.published
        }
    };
}

function* fetchFavourites() {
    yield put({ type: FETCH_FAVOURITES_BEGIN });
    try {
        const response = yield call(userApiGet, `${AD_USER_API}/api/v1/userfavouriteads?size=999&sort=favouriteAd.published,desc`);
        yield put({ type: FETCH_FAVOURITES_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_FAVOURITES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* addToFavourites(action) {
    if (yield requiresAuthentication(AuthenticationCaller.ADD_FAVORITE)) {
        let state = yield select();
        if (!state.user.user) {
            yield put({type: SHOW_TERMS_OF_USE_MODAL});
            yield take([HIDE_TERMS_OF_USE_MODAL, CREATE_USER_SUCCESS]);
        }
        state = yield select();
        if (state.user.user) {
            let favourite;
            const foundInSearchResult = state.search.searchResult && state.search.searchResult.stillinger &&
                state.search.searchResult.stillinger.find((s) => s.uuid === action.uuid);

            if (foundInSearchResult) {
                favourite = toFavourite(foundInSearchResult.uuid, foundInSearchResult);
            } else if (state.stilling.stilling._id === action.uuid) {
                favourite = toFavourite(state.stilling.stilling._id, state.stilling.stilling._source);
            } else {
                return;
            }
            try {
                yield put({ type: ADD_TO_FAVOURITES_BEGIN, favourite });
                const response = yield call(userApiPost, `${AD_USER_API}/api/v1/userfavouriteads`, favourite);
                yield put({ type: ADD_TO_FAVOURITES_SUCCESS, response });
                yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'added' });
                yield call(delay, 5000);
                yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: ADD_TO_FAVOURITES_FAILURE, error: e, uuid: favourite.favouriteAd.uuid });
                } else {
                    throw e;
                }
            }
        }
    }
}

function* removeFromFavourites(action) {
    const state = yield select();
    const favourite = state.favourites.favourites.find((f) => f.favouriteAd.uuid === action.uuid);
    try {
        yield put({ type: REMOVE_FROM_FAVOURITES_BEGIN, favourite });
        yield call(userApiRemove, `${AD_USER_API}/api/v1/userfavouriteads/${favourite.uuid}`);
        yield put({ type: REMOVE_FROM_FAVOURITES_SUCCESS, favourite });
        yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'removed' });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: REMOVE_FROM_FAVOURITES_FAILURE, error: e, favourite });
        } else {
            throw e;
        }
    }
}

export const favouritesSaga = function* saga() {
    yield takeLatest(FETCH_USER_SUCCESS, fetchFavourites);
    yield takeLatest(ADD_TO_FAVOURITES, addToFavourites);
    yield takeLatest(REMOVE_FROM_FAVOURITES, removeFromFavourites);
};
