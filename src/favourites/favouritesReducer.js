/* eslint-disable no-underscore-dangle */
import { select, put, call, takeLatest, take } from 'redux-saga/effects';
import { get, post, remove, SearchApiError } from '../api/api';
import { AD_USER_API } from '../fasitProperties';
import { FETCH_USER_SUCCESS, FETCH_USER } from '../authorization/authorizationReducer';
import history from '../history';
import featureToggle from '../featureToggle';

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
    shouldFetchFavourites: true,
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
                shouldFetchFavourites: false,
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
                favourites: [...state.favourites, action.response]
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
                showAlertStripe: false
            };
        case REMOVE_FROM_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'remove_error',
                showAlertStripe: false
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
            applicationdue: ad.properties.applicationdue,
            location: ad.properties.location,
            employer: ad.properties.employer
        }
    };
}

function* fetchFavourites() {
    let state = yield select();
    if (featureToggle() && state.favourites.shouldFetchFavourites) {
        if (state.authorization.shouldFetchUser) {
            yield put({ type: FETCH_USER });
            yield take(FETCH_USER_SUCCESS);
            state = yield select();
        }
        if (state.authorization.isLoggedIn && (state.authorization.termsStatus === 'accepted')) {
            yield put({ type: FETCH_FAVOURITES_BEGIN });
            try {
                const response = yield call(
                    get,
                    `${AD_USER_API}/api/v1/userfavouriteads?size=999`
                );
                yield put({ type: FETCH_FAVOURITES_SUCCESS, response });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: FETCH_FAVOURITES_FAILURE, error: e });
                } else {
                    throw e;
                }
            }
        }
    }
}

function* addToFavourites(action) {
    const state = yield select();
    try {
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
        yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'added' });
        yield put({ type: ADD_TO_FAVOURITES_BEGIN, uuid: favourite.favouriteAd.uuid });
        const response = yield call(post, `${AD_USER_API}/api/v1/userfavouriteads`, favourite);
        yield put({ type: ADD_TO_FAVOURITES_SUCCESS, response });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: ADD_TO_FAVOURITES_FAILURE, error: e });
            if (e.statusCode === 404) {
                yield call(history.push, '/vilkaar');
            }
        } else {
            throw e;
        }
    }
}

function* removeFromFavourites(action) {
    try {
        const state = yield select();
        const adToDelete = state.favourites.favourites.find((favourite) => favourite.favouriteAd.uuid === action.uuid);
        yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'removed' });
        yield put({ type: REMOVE_FROM_FAVOURITES_BEGIN, uuid: action.uuid });
        yield call(remove, `${AD_USER_API}/api/v1/userfavouriteads/${adToDelete.uuid}`);
        yield put({ type: REMOVE_FROM_FAVOURITES_SUCCESS });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: REMOVE_FROM_FAVOURITES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const favouritesSaga = function* saga() {
    yield takeLatest(FETCH_FAVOURITES, fetchFavourites);
    yield takeLatest(ADD_TO_FAVOURITES, addToFavourites);
    yield takeLatest(REMOVE_FROM_FAVOURITES, removeFromFavourites);
};
