/* eslint-disable no-underscore-dangle */
import { call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, remove, SearchApiError } from '../api/api';
import { FETCH_USER_SUCCESS } from '../authorization/authorizationReducer';
import { AD_USER_API, CONTEXT_PATH } from '../fasitProperties';
import history from '../history';

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
    httpErrorStatus: undefined,
    alertStripeMode: 'added',
    totalElements: 0,
    favouriteAdUuidList: []
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
                favouriteAdUuidList: [...state.favouriteAdUuidList, action.uuid]
            };
        case FETCH_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: action.response.content,
                favouriteAdUuidList: action.response.content.map((favourite) => (favourite.favouriteAd.uuid)),
                totalElements: action.response.totalElements,
                isFetchingFavourites: false,
                httpErrorStatus: undefined
            };
        case FETCH_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                httpErrorStatus: action.error.statusCode,
                isFetchingFavourites: false
            };
        case ADD_TO_FAVOURITES_BEGIN:
            return {
                ...state,
                favouriteAdUuidList: [...state.favouriteAdUuidList, action.uuid],
                totalElements: state.totalElements + 1
            };
        case ADD_TO_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: [action.response, ...state.favourites]
            };
        case REMOVE_FROM_FAVOURITES_BEGIN:
            return {
                ...state,
                favourites: state.favourites.filter((favourite) => favourite.favouriteAd.uuid !== action.uuid),
                favouriteAdUuidList: state.favouriteAdUuidList.filter((uuid) => uuid !== action.uuid),
                totalElements: state.totalElements - 1
            };
        case ADD_TO_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'add_error',
                favourites: state.favourites.filter((favourite) => favourite.favouriteAd.uuid !== action.uuid),
                favouriteAdUuidList: state.favouriteAdUuidList.filter((uuid) => uuid !== action.uuid),
                totalElements: state.totalElements - 1,
                showAlertStripe: false
            };
        case REMOVE_FROM_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'remove_error',
                showAlertStripe: false,
                favourites: [...state.favourites, action.favourite],
                favouriteAdUuidList: [...state.favouriteAdUuidList, action.favourite.favouriteAd.uuid],
                totalElements: state.totalElements + 1
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

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function toFavourite(uuid, ad) {
    return {
        favouriteAd: {
            uuid,
            title: ad.title,
            updated: ad.updated,
            jobTitle: ad.properties.jobtitle ? ad.properties.jobtitle : '',
            status: ad.status,
            applicationdue: ad.properties.applicationdue ? ad.properties.applicationdue : '',
            location: ad.properties.location ? ad.properties.location : '',
            employer: ad.properties.employer ? ad.properties.employer : ''
        }
    };
}

function* fetchFavourites() {
    yield put({ type: FETCH_FAVOURITES_BEGIN });
    try {
        const response = yield call(get, `${AD_USER_API}/api/v1/userfavouriteads?size=999&sort=favouriteAd.updated,desc`);
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
    const state = yield select();
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
        yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'added' });
        yield put({ type: ADD_TO_FAVOURITES_BEGIN, uuid: favourite.favouriteAd.uuid });
        const response = yield call(post, `${AD_USER_API}/api/v1/userfavouriteads`, favourite);
        yield put({ type: ADD_TO_FAVOURITES_SUCCESS, response });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ADD_TO_FAVOURITES_FAILURE, error: e, uuid: favourite.favouriteAd.uuid });
            if (e.statusCode === 404) {
                yield call(history.push, `${CONTEXT_PATH}/vilkaar`);
            }
        } else {
            throw e;
        }
    }
}

function* removeFromFavourites(action) {
    const state = yield select();
    const adToDelete = state.favourites.favourites.find((favourite) => favourite.favouriteAd.uuid === action.uuid);
    try {
        yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'removed' });
        yield put({ type: REMOVE_FROM_FAVOURITES_BEGIN, uuid: action.uuid });
        yield call(remove, `${AD_USER_API}/api/v1/userfavouriteads/${adToDelete.uuid}`);
        yield put({ type: REMOVE_FROM_FAVOURITES_SUCCESS });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: REMOVE_FROM_FAVOURITES_FAILURE, error: e, favourite: adToDelete });
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
