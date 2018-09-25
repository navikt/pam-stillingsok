import { select, takeLatest, put } from 'redux-saga/effects';
import { SET_CURRENT_SAVED_SEARCH } from './savedSearches/savedSearchesReducer';
import { SET_VALUE } from './search/searchBox/searchBoxReducer';
import { PAGE_SIZE, RESET_SEARCH, SEARCH, SET_MODE } from './search/searchReducer';
import { fromUrl, ParameterType, toUrl } from './search/url';

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
        mode: state.search.mode ? state.search.mode : undefined,
        saved: state.savedSearches.currentSavedSearch ? state.savedSearches.currentSavedSearch.uuid : undefined
    };

    try {
        yield sessionStorage.setItem('url', toUrl(x));
    } catch (e) {
        // Ignore session storage error
    }
}

function* restoreStateFromUrl(action) {
    if (action.url) {
        yield put({
            type: RESTORE_STATE_FROM_URL,
            query: fromUrl(SEARCH_PARAMETERS_DEFINITION, action.url),
            url: action.url
        });
    }
}

export const urlSaga = function* saga() {
    yield takeLatest([
        SEARCH,
        RESET_SEARCH,
        SET_CURRENT_SAVED_SEARCH,
        SET_MODE,
        SET_VALUE
    ], updateUrl);
    yield takeLatest(RESTORE_STATE_FROM_URL_BEGIN, restoreStateFromUrl);
};
