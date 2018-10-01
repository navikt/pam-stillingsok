import { select, takeLatest, put } from 'redux-saga/effects';
import { SET_CURRENT_SAVED_SEARCH } from './savedSearches/savedSearchesReducer';
import { SET_VALUE } from './search/searchBox/searchBoxReducer';
import { LOAD_MORE, PAGE_SIZE, RESET_SEARCH, SEARCH } from './search/searchReducer';
import { fromUrl, ParameterType, toUrl } from './search/url';
import { SET_VIEW_MODE } from './search/viewMode/viewModeReducer';

export const RESTORE_STATE_FROM_URL_BEGIN = 'RESTORE_STATE_FROM_URL_BEGIN';
export const RESTORE_STATE_FROM_URL = 'RESTORE_STATE_FROM_URL';

export const SEARCH_PARAMETERS_DEFINITION = {
    q: ParameterType.STRING,
    sort: ParameterType.STRING,
    to: ParameterType.NUMBER,
    counties: ParameterType.ARRAY,
    municipals: ParameterType.ARRAY,
    published: ParameterType.ARRAY,
    engagementType: ParameterType.ARRAY,
    sector: ParameterType.ARRAY,
    extent: ParameterType.ARRAY,
    occupationFirstLevels: ParameterType.ARRAY,
    occupationSecondLevels: ParameterType.ARRAY,
    mode: ParameterType.STRING,
    saved: ParameterType.STRING
};

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
        yield sessionStorage.setItem('url', toUrl(x));
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
                query: fromUrl(SEARCH_PARAMETERS_DEFINITION, url)
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
        SET_VIEW_MODE,
        SET_VALUE,
        LOAD_MORE
    ], updateUrl);
    yield takeLatest(RESTORE_STATE_FROM_URL_BEGIN, restoreStateFromUrl);
};
