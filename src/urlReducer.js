import { select, takeLatest, put } from 'redux-saga/effects';
import { ADD_SAVED_SEARCH_SUCCESS, SET_CURRENT_SAVED_SEARCH } from './savedSearches/savedSearchesReducer';
import { SET_VALUE } from './search/searchBox/searchBoxReducer';
import { LOAD_MORE, PAGE_SIZE, RESET_SEARCH, SEARCH } from './search/searchReducer';
import { SET_VIEW_MODE } from './search/viewMode/viewModeReducer';
import { toQueryString, toObject } from "./search/url";
import { removeUndefinedOrEmptyString } from './utils';

export const RESTORE_STATE_FROM_URL_BEGIN = 'RESTORE_STATE_FROM_URL_BEGIN';
export const RESTORE_STATE_FROM_URL = 'RESTORE_STATE_FROM_URL';

function* updateUrl() {
    const state = yield select();

    const x = {
        q: state.searchBox.q,
        sort: state.sorting.sort,
        to: state.search.to > PAGE_SIZE ? state.search.to : undefined,
        counties: state.counties.checkedCounties,
        municipals: state.counties.checkedMunicipals,
        published: state.published.checkedPublished,
        engagementType: state.engagement.checkedEngagementType,
        sector: state.sector.checkedSector,
        extent: state.extent.checkedExtent,
        occupationFirstLevels: state.occupations.checkedFirstLevels,
        occupationSecondLevels: state.occupations.checkedSecondLevels,
        mode: state.viewMode.mode ? state.viewMode.mode : undefined,
        saved: state.savedSearches.currentSavedSearch ? state.savedSearches.currentSavedSearch.uuid : undefined
    };

    try {
        yield sessionStorage.setItem('url', toQueryString(removeUndefinedOrEmptyString(x)));
    } catch (e) {
        // Ignore session storage error
    }
}

function* restoreStateFromUrl() {
    try {
        const url = sessionStorage.getItem('url');
        if (url && url !== null) {
            yield put({
                type: RESTORE_STATE_FROM_URL,
                query: toObject(url)
            });
        }
    } catch (e) {
        // Ignore session storage error
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
};
