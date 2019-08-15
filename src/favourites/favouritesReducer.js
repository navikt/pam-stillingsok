/* eslint-disable no-underscore-dangle */
import { call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import SearchApiError from '../api/SearchApiError';
import { userApiGet, userApiPost, userApiRemove } from '../api/userApi';
import AuthenticationCaller from '../authentication/AuthenticationCaller';
import {
    authenticationEnum,
    FETCH_IS_AUTHENTICATED_SUCCESS,
    requiresAuthentication
} from '../authentication/authenticationReducer';
import getEmployer from '../common/utils/getEmployer';
import getWorkLocation from '../common/utils/getWorkLocation';
import { AD_USER_API } from '../fasitProperties';
import { SEARCH_END } from '../search/searchReducer';
import { FETCH_STILLING_SUCCESS } from '../stilling/stillingReducer';
import {
    CREATE_USER_SUCCESS,
    FETCH_USER_FAILURE_NO_USER,
    FETCH_USER_SUCCESS,
    HIDE_TERMS_OF_USE_MODAL,
    SHOW_TERMS_OF_USE_MODAL
} from '../user/userReducer';

export const FETCH_FAVOURITES = 'FETCH_FAVOURITES';
export const FETCH_FAVOURITES_BEGIN = 'FETCH_FAVOURITES_BEGIN';
export const FETCH_FAVOURITES_SUCCESS = 'FETCH_FAVOURITES_SUCCESS';
export const FETCH_FAVOURITES_FAILURE = 'FETCH_FAVOURITES_FAILURE';

export const ADD_SEARCH_RESULT_TO_FAVOURITES = 'ADD_SEARCH_RESULT_TO_FAVOURITES';
export const ADD_STILLING_TO_FAVOURITES = 'ADD_STILLING_TO_FAVOURITES';
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

export const RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN_SEARCH = 'RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN_SEARCH';
export const RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN_AD = 'RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN_AD';

let delayTimeout;

const initialState = {
    isFetchingFavourites: false,
    favourites: [],
    hasFetchedInitialFavourites: false,
    confirmationVisible: false,
    favouriteAboutToBeRemoved: undefined,
    showAlertStripe: false,
    error: undefined,
    alertStripeMode: 'added',
    totalElements: 0,
    adsMarkedAsFavorite: [],
    pendingFavouritesByAdUuid: [],
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
                isFetchingFavourites: false,
                hasFetchedInitialFavourites: true
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
                adsMarkedAsFavorite: [...state.adsMarkedAsFavorite, action.adUuid],
                pendingFavouritesByAdUuid: [...state.pendingFavouritesByAdUuid, action.adUuid]
            };
        case ADD_TO_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: [action.response, ...state.favourites],
                totalElements: state.totalElements + 1,
                pendingFavouritesByAdUuid: state.pendingFavouritesByAdUuid.filter((adUuid) => adUuid !== action.adUuid)
            };
        case ADD_TO_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'add_error',
                adsMarkedAsFavorite: state.adsMarkedAsFavorite.filter((adUuid) => adUuid !== action.adUuid),
                pendingFavouritesByAdUuid: state.pendingFavouritesByAdUuid.filter((adUuid) => adUuid !== action.adUuid)
            };
        case REMOVE_FROM_FAVOURITES_BEGIN:
            return {
                ...state,
                adsMarkedAsFavorite: state.adsMarkedAsFavorite.filter((adUuid) => adUuid !== action.adUuid),
                pending: [...state.pending, action.favouriteUuid],
                pendingFavouritesByAdUuid: [...state.pendingFavouritesByAdUuid, action.adUuid]
            };
        case REMOVE_FROM_FAVOURITES_SUCCESS:
            return {
                ...state,
                favourites: state.favourites.filter((favourite) => favourite.uuid !== action.favouriteUuid),
                totalElements: state.totalElements - 1,
                pending: state.pending.filter((uuid) => uuid !== action.favouriteUuid),
                pendingFavouritesByAdUuid: state.pendingFavouritesByAdUuid.filter((adUuid) => adUuid !== action.adUuid)
            };
        case REMOVE_FROM_FAVOURITES_FAILURE:
            return {
                ...state,
                error: 'remove_error',
                adsMarkedAsFavorite: [...state.adsMarkedAsFavorite, action.adUuid],
                pending: state.pending.filter((uuid) => uuid !== action.favouriteUuid),
                pendingFavouritesByAdUuid: state.pendingFavouritesByAdUuid.filter((adUuid) => adUuid !== action.adUuid)
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

const delay = (ms) => {
    if (delayTimeout) {
        clearTimeout(delayTimeout);
    }
    return new Promise((resolve) => {
        delayTimeout = setTimeout(resolve, ms);
    });
};

function toFavourite(uuid, ad) {
    return {
        favouriteAd: {
            uuid,
            title: ad.title,
            jobTitle: ad.properties.jobtitle ? ad.properties.jobtitle : null,
            status: ad.status,
            applicationdue: ad.properties.applicationdue ? ad.properties.applicationdue : null,
            location: getWorkLocation(ad.properties.location, ad.locationList),
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

function* addSearchResultToFavourites(action) {
    const state = yield select();
    const foundInSearchResult = state.search.searchResult && state.search.searchResult.stillinger &&
        state.search.searchResult.stillinger.find((s) => s.uuid === action.uuid);
    if (foundInSearchResult) {
        yield call(
            addToFavourites,
            foundInSearchResult.uuid,
            foundInSearchResult,
            {
                callbackId: 'add-to-favourite-search',
                data: action.uuid
            }
        )
    }
}

function* addStillingToFavourites() {
    const state = yield select();
    yield call(
        addToFavourites,
        state.stilling.stilling._id,
        state.stilling.stilling._source,
        {
            callbackId: 'add-to-favourite-ad',
            data: state.stilling.stilling._id
        }
    );
}

function* addToFavourites(uuid, stilling, callback) {
    if (yield requiresAuthentication(AuthenticationCaller.ADD_FAVORITE, callback)) {
        let state = yield select();

        // Unngå at det legges til duplikate favoritter. Dette kan f.eks skje om bruker ikke var innlogget
        // da man favorittmarkerte en stilling
        if (state.favourites.favourites.find((favourite) => favourite.favouriteAd.uuid === uuid)) {
            yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'added' });
            yield call(delay, 5000);
            yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
            return;
        }

        if (!state.user.user) {
            yield put({ type: SHOW_TERMS_OF_USE_MODAL });
            yield take([HIDE_TERMS_OF_USE_MODAL, CREATE_USER_SUCCESS]);
        }
        state = yield select();
        if (state.user.user) {
            const favourite = toFavourite(uuid, stilling);
            const adUuid = favourite.favouriteAd.uuid;
            try {
                yield put({ type: ADD_TO_FAVOURITES_BEGIN, adUuid: uuid });
                const response = yield call(userApiPost, `${AD_USER_API}/api/v1/userfavouriteads`, favourite);
                yield put({ type: ADD_TO_FAVOURITES_SUCCESS, response, adUuid });
                yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'added' });
                yield call(delay, 5000);
                yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: ADD_TO_FAVOURITES_FAILURE, error: e, adUuid });
                } else {
                    throw e;
                }
            }
        }
    }
}

/**
 * Hvis brukeren måtte logge inn for å kunne legge til en favoritt, så skal favoritten
 * bli lagret når man returneres fra login-siden.
 * @see handleCallbackAfterLogin
 */
function* restoreWorkflowAfterLoginSearch(action) {
    let state = yield select();

    // Sørg først for at alle nødvendige data er lastet og gjennoprettet
    if (state.authentication.isAuthenticated === authenticationEnum.AUTHENTICATION_PENDING) {
        yield take(FETCH_IS_AUTHENTICATED_SUCCESS);
        state = yield select();
    }
    if (state.user.user === undefined) {
        yield take([FETCH_USER_SUCCESS, FETCH_USER_FAILURE_NO_USER]);
        state = yield select();
    }
    if (!state.search.initialSearchDone) {
        yield take(SEARCH_END);
        state = yield select();
    }
    if (state.user.user !== undefined && state.favourites.hasFetchedInitialFavourites === false) {
        yield take(FETCH_FAVOURITES_SUCCESS);
    }

    yield call(addSearchResultToFavourites, { uuid: action.data })
}

function* restoreWorkflowAfterLoginAd(action) {
    let state = yield select();
    if (state.authentication.isAuthenticated === authenticationEnum.AUTHENTICATION_PENDING) {
        yield take(FETCH_IS_AUTHENTICATED_SUCCESS);
    }
    state = yield select();
    if (state.user.user === undefined) {
        yield take([FETCH_USER_SUCCESS, FETCH_USER_FAILURE_NO_USER]);
    }
    state = yield select();
    if (state.stilling.stilling === undefined) {
        yield take(FETCH_STILLING_SUCCESS);
    }
    state = yield select();
    if (state.favourites.hasFetchedInitialFavourites === false) {
        yield take(FETCH_FAVOURITES_SUCCESS);
    }
    if(state.stilling.stilling._id === action.data) {
        yield call(addStillingToFavourites)
    }
}

function* removeFromFavourites(action) {
    const state = yield select();
    const favourite = state.favourites.favourites.find((f) => f.favouriteAd.uuid === action.uuid);
    const adUuid = favourite.favouriteAd.uuid;
    const favouriteUuid = favourite.uuid;
    try {
        yield put({ type: REMOVE_FROM_FAVOURITES_BEGIN, adUuid, favouriteUuid });
        yield call(userApiRemove, `${AD_USER_API}/api/v1/userfavouriteads/${favourite.uuid}`);
        yield put({ type: REMOVE_FROM_FAVOURITES_SUCCESS, adUuid, favouriteUuid });
        yield put({ type: SHOW_FAVOURITES_ALERT_STRIPE, alertStripeMode: 'removed' });
        yield call(delay, 5000);
        yield put({ type: HIDE_FAVOURITES_ALERT_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({
                type: REMOVE_FROM_FAVOURITES_FAILURE, error: e, adUuid, favouriteUuid
            });
        } else {
            throw e;
        }
    }
}

export const favouritesSaga = function* saga() {
    yield takeLatest(FETCH_USER_SUCCESS, fetchFavourites);
    yield takeEvery(ADD_SEARCH_RESULT_TO_FAVOURITES, addSearchResultToFavourites);
    yield takeEvery(ADD_STILLING_TO_FAVOURITES, addStillingToFavourites);
    yield takeEvery(REMOVE_FROM_FAVOURITES, removeFromFavourites);
    yield takeLatest(RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN_SEARCH, restoreWorkflowAfterLoginSearch);
    yield takeLatest(RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN_AD, restoreWorkflowAfterLoginAd);
};
