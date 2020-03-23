import {put, select, takeEvery} from 'redux-saga/effects';
import {AD_USER_API, CONTEXT_PATH, LOGIN_URL, PAM_VAR_SIDE_URL, STILLINGSOK_URL} from '../fasitProperties';
import {RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN} from '../favourites/favouritesReducer';
import {RESTORE_SAVED_SEARCH_WORKFLOW_AFTER_LOGIN} from '../savedSearches/savedSearchesReducer';
import {toBrowserSearchQuery} from '../search/searchQueryReducer';
import {decodeUrl, parseQueryString, stringifyQueryObject} from '../utils';
import AuthenticationCaller from './AuthenticationCaller';
import LocationSearchParser from '../common/utils/LocationSearchParser';

export const REDIRECT_TO_LOGIN = 'REDIRECT_TO_LOGIN';
export const SET_CALLBACK_AFTER_LOGIN = 'SET_CALLBACK_AFTER_LOGIN';
export const HANDLE_CALLBACK_AFTER_LOGIN = 'HANDLE_CALLBACK_AFTER_LOGIN';

export const FETCH_IS_AUTHENTICATED = 'FETCH_IS_AUTHENTICATED';
export const FETCH_IS_AUTHENTICATED_SUCCESS = 'FETCH_IS_AUTHENTICATED_SUCCESS';
export const FETCH_IS_AUTHENTICATED_FAILURE = 'FETCH_IS_AUTHENTICATED_FAILURE';

export const SHOW_AUTHENTICATION_REQUIRED_MODAL = 'SHOW_AUTHENTICATION_REQUIRED_MODAL';
export const HIDE_AUTHENTICATION_REQUIRED_MODAL = 'HIDE_AUTHENTICATION_REQUIRED_MODAL';

const SESSION_STORAGE_KEY_CALLBACK = 'callback';
const SESSION_STORAGE_KEY_CALLBACK_DATA = 'callback-data';

const whiteList = [
    `${CONTEXT_PATH}/intern`,
    `${CONTEXT_PATH}/stilling`,
    `${CONTEXT_PATH}/favoritter`,
    `${CONTEXT_PATH}/lagrede-sok`,
    CONTEXT_PATH
];

export const authenticationEnum = {
    IS_AUTHENTICATED: 'IS_AUTHENTICATED',
    NOT_AUTHENTICATED: 'NOT_AUTHENTICATED',
    AUTHENTICATION_FAILURE: 'AUTHENTICATION_FAILURE',
    AUTHENTICATION_PENDING: 'AUTHENTICATION_PENDING'
};

const initialState = {
    isAuthenticated: authenticationEnum.AUTHENTICATION_PENDING,
    authenticationRequiredModalIsVisible: false,
    callbackAfterLogin: undefined
};

export default function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_IS_AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.isAuthenticated
            };
        case FETCH_IS_AUTHENTICATED_FAILURE:
            return {
                ...state,
                isAuthenticated: authenticationEnum.AUTHENTICATION_FAILURE
            };
        case SHOW_AUTHENTICATION_REQUIRED_MODAL:
            return {
                ...state,
                authenticationRequiredModalIsVisible: true,
                authenticationRequiredTitle: action.title
            };
        case HIDE_AUTHENTICATION_REQUIRED_MODAL:
            return {
                ...state,
                authenticationRequiredModalIsVisible: false
            };
        case SET_CALLBACK_AFTER_LOGIN:
            return {
                ...state,
                callbackAfterLogin: action.callbackAfterLogin
            };
        default:
            return state;
    }
}

function* fetchIsAuthenticated() {
    try {
        const response = yield fetch(`${AD_USER_API}/isAuthenticated`, {
            credentials: 'include',
            referrer: CONTEXT_PATH
        });
        if (response.status === 200) {
            yield put({type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: authenticationEnum.IS_AUTHENTICATED});
        } else if (response.status === 401) {
            yield put({type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: authenticationEnum.NOT_AUTHENTICATED});
        } else {
            yield put({type: FETCH_IS_AUTHENTICATED_FAILURE});
        }
    } catch (error) {
        yield put({type: FETCH_IS_AUTHENTICATED_FAILURE});
        throw error;
    }
}

/**
 * Sjekker om bruker er innlogget. Hvis bruker ikke er innlogget så viser den modalen som
 * ber bruker logge inn.
 */
export function* requiresAuthentication(caller, callbackAfterLogin) {
    const state = yield select();
    if (state.authentication.isAuthenticated === authenticationEnum.IS_AUTHENTICATED) {
        return true;
    }

    yield put({
        type: SET_CALLBACK_AFTER_LOGIN,
        callbackAfterLogin
    });

    yield put({type: SHOW_AUTHENTICATION_REQUIRED_MODAL, title: caller || AuthenticationCaller.DEFAULT});
    return false;
};

/**
 * Sender brukeren til loginsiden. Sørger også for å sende med den url'en bruker skal redirectes tilbake
 * til etter vellykket innlogging.
 */
export function* redirectToLogin(action) {
    let redirectUrlAfterSuccessfulLogin;

    if (action.role === 'arbeidsgiver') {
        redirectUrlAfterSuccessfulLogin = PAM_VAR_SIDE_URL;
    } else {
        const state = yield select();
        const callback = state.authentication.callbackAfterLogin;

        let redirectUrl;
        let redirectQuery = {};
        let path = window.location.pathname;

        if (path.startsWith(`${CONTEXT_PATH}/stilling/`)) {
            // 'stilling/:uuid' er ikke en whitelisted url, så vi må mappe om til /stilling?uuid=<uuid>
            // Man blir redirectet til rett url igjen i server.js
            redirectQuery = {
                ...redirectQuery,
                uuid: path.split(`${CONTEXT_PATH}/stilling/`)[1]
            };
            redirectUrl = `${STILLINGSOK_URL}/stilling`;
        } else if (path.startsWith(`${CONTEXT_PATH}/intern/`)) {
            // 'intern/:uuid' er ikke en whitelisted url, så vi må mappe om til /intern?uuid=<uuid>
            // Man blir redirectet til rett url igjen i server.js
            redirectQuery = {
                ...redirectQuery,
                uuid: path.split(`${CONTEXT_PATH}/intern/`)[1]
            };
            redirectUrl = `${STILLINGSOK_URL}/intern`;
        } else if (path.startsWith(`${CONTEXT_PATH}/lagrede-sok`)) {
            redirectQuery = {
                ...redirectQuery,
            };

            const uuid = LocationSearchParser.extractParam('uuid');
            if (uuid !== null) redirectQuery['uuid'] = uuid;

            redirectUrl = `${STILLINGSOK_URL}/lagrede-sok`;
        } else if (path === CONTEXT_PATH) {
            redirectQuery = {
                ...redirectQuery,
                ...toBrowserSearchQuery(state.searchQuery)
            };
            redirectUrl = STILLINGSOK_URL;
        } else if (whiteList.includes(path)) {
            redirectUrl = `${STILLINGSOK_URL}/${path.split(`${CONTEXT_PATH}/`)[1]}`;
        } else {
            redirectUrl = STILLINGSOK_URL;
        }

        if (callback) {
            redirectQuery = {
                ...redirectQuery,
                callback: callback.callbackId
            };

            sessionStorage.setItem(SESSION_STORAGE_KEY_CALLBACK, callback.callbackId);
            if (callback.data) {
                sessionStorage.setItem(SESSION_STORAGE_KEY_CALLBACK_DATA, callback.data);
            }
        }
        redirectUrlAfterSuccessfulLogin = `${redirectUrl}${encodeURIComponent(stringifyQueryObject(redirectQuery))}`;
    }

    window.location.href = `${LOGIN_URL}?level=Level3&redirect=${redirectUrlAfterSuccessfulLogin}`;
}

/**
 * Håndterer callbacks etter login. Browser-url kan inneholde f.eks '?callback=save-search'. Brukes da til å
 * gjennopprette flyten før bruker måtte logge inn i det han eller hun ville lagre et søk.
 */
function* handleCallbackAfterLogin() {
    const queryString = decodeUrl(document.location.search);
    const query = parseQueryString(queryString);

    if (query.callback) {
        // Fjern '?callback' fra adresselinjen i nettleseren
        const {callback, ...queryWithoutCallback} = query;
        window.history.replaceState({}, '', CONTEXT_PATH + stringifyQueryObject(queryWithoutCallback));

        // For å unngå at callbacks kjøres på nytt (hvis man for eksempel trykker tilbake i browser),
        // så  utfører vi kun callback hvis samme callback er lagret i sessionStorage.
        const found = sessionStorage.getItem(SESSION_STORAGE_KEY_CALLBACK);
        if (found === 'save-search' && callback === 'save-search') {
            yield put({type: RESTORE_SAVED_SEARCH_WORKFLOW_AFTER_LOGIN});
        } else if (found === 'add-to-favourite-search' && callback === 'add-to-favourite-search') {
            const data = sessionStorage.getItem(SESSION_STORAGE_KEY_CALLBACK_DATA);
            yield put({type: RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN, data, source: 'search'});
        } else if (found === 'add-to-favourite-ad' && callback === 'add-to-favourite-ad') {
            const data = sessionStorage.getItem(SESSION_STORAGE_KEY_CALLBACK_DATA);
            yield put({type: RESTORE_ADD_FAVOURITE_WORKFLOW_AFTER_LOGIN, data, source: 'ad'});
        }
    }

    // Sørg alltid for å fjerne callback fra sessionStorage. En gammel callback kan ha blitt
    // liggende hvis f.eks bruker ikke ble returnert etter en tidligere feilet innlogging.
    sessionStorage.removeItem(SESSION_STORAGE_KEY_CALLBACK);
    sessionStorage.removeItem(SESSION_STORAGE_KEY_CALLBACK_DATA);
}

function* cancelCallbackAfterLogin() {
    yield put({
        type: SET_CALLBACK_AFTER_LOGIN,
        callback: undefined
    });
}

export const authenticationSaga = function* saga() {
    yield takeEvery(REDIRECT_TO_LOGIN, redirectToLogin);
    yield takeEvery(HANDLE_CALLBACK_AFTER_LOGIN, handleCallbackAfterLogin);
    yield takeEvery(FETCH_IS_AUTHENTICATED, fetchIsAuthenticated);
    yield takeEvery(HIDE_AUTHENTICATION_REQUIRED_MODAL, cancelCallbackAfterLogin);
};
