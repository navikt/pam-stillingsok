import { select, takeLatest, put } from 'redux-saga/effects';
import { ADD_SAVED_SEARCH_SUCCESS, SET_CURRENT_SAVED_SEARCH } from './savedSearches/savedSearchesReducer';
import { SET_VALUE } from './search/searchBox/searchBoxReducer';
import { SET_VIEW_MODE } from './search/viewMode/viewModeReducer';
import { toQueryString, toObject } from './search/url';
import { isNonEmpty, removeUndefinedOrEmptyString } from './utils';
import {
    LOAD_MORE,
    RESET_SEARCH,
    SEARCH,
    toSearchQuery
} from './search/searchReducer';

export const RESTORE_STATE_FROM_URL_BEGIN = 'RESTORE_STATE_FROM_URL_BEGIN';
export const RESTORE_STATE_FROM_URL = 'RESTORE_STATE_FROM_URL';
export const RESTORE_STATE_FROM_SESSION_STORAGE = 'RESTORE_STATE_FROM_SESSION_STORAGE';
export const SAVE_URL = 'SAVE_URL';

const LATEST_QUERY_URL_KEY = 'latestQueryUrl';

export function urlFromSessionStorageOrIndex() {
    const url = sessionStorage.getItem(LATEST_QUERY_URL_KEY);
    return url ? `/${url}` : '/';
}

function* saveUrl({ url }) {
    window.history.pushState({}, '', url);
    yield sessionStorage.setItem(LATEST_QUERY_URL_KEY, url);
}

function* updateUrl() {
    const state = yield select();
    const query = toSearchQuery(state);
    const queryString = toQueryString(removeUndefinedOrEmptyString(query));

    yield put({ type: SAVE_URL, url: queryString });
}

function* restoreStateFromSessionStorage() {
    const url = sessionStorage.getItem(LATEST_QUERY_URL_KEY);
    yield put({ type: RESTORE_STATE_FROM_URL, query: toObject(url) });
}

function* restoreStateFromUrl() {
    const searchString = document.location.search;
    const query = toObject(searchString);

    if (searchString.length > 0 && isNonEmpty(query)) {;
        yield put({ type: SAVE_URL, url: searchString })
        yield put({ type: RESTORE_STATE_FROM_URL, query });
    } else {
        yield put({ type: RESTORE_STATE_FROM_SESSION_STORAGE });
    }
}

export const urlSaga = function* saga() {
    yield takeLatest([
        SEARCH,
        RESET_SEARCH,
        SET_CURRENT_SAVED_SEARCH,
        ADD_SAVED_SEARCH_SUCCESS,
        SET_VIEW_MODE,
        SET_VALUE,
        LOAD_MORE
    ], updateUrl);
    yield takeLatest(RESTORE_STATE_FROM_URL_BEGIN, restoreStateFromUrl);
    yield takeLatest(RESTORE_STATE_FROM_SESSION_STORAGE, restoreStateFromSessionStorage);
    yield takeLatest(SAVE_URL, saveUrl);
};
