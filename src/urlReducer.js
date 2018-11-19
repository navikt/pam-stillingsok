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

const LATEST_QUERY_STRING_KEY = 'latestQueryString';

export function urlFromSessionStorageOrIndex() {
    const url = sessionStorage.getItem(LATEST_QUERY_STRING_KEY);
    return url ? `/${url}` : '/';
}

function setCurrentQueryString(queryString) {
    window.history.replaceState({}, '', queryString);
    sessionStorage.setItem(LATEST_QUERY_STRING_KEY, queryString);
}

function* updateUrl() {
    const state = yield select();
    const query = toSearchQuery(state);
    const queryString = toQueryString(removeUndefinedOrEmptyString(query));

    setCurrentQueryString(queryString);
}

function* restoreStateFromUrl() {
    const searchString = document.location.search;
    const query = toObject(searchString);

    if (searchString.length > 0 && isNonEmpty(query)) {
        yield put({ type: RESTORE_STATE_FROM_URL, query });
    }

    setCurrentQueryString(searchString || '');
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
};
