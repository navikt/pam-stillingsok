import { put, select, takeLatest } from 'redux-saga/effects';
import { ADD_SAVED_SEARCH_SUCCESS, SET_CURRENT_SAVED_SEARCH } from './savedSearches/savedSearchesReducer';
import { SET_VALUE } from './search/searchBox/searchBoxReducer';
import { LOAD_MORE, PAGE_SIZE, RESET_SEARCH, SEARCH } from './search/searchReducer';
import { toObject, toQueryString } from './search/url';
import { SET_VIEW_MODE } from './search/viewMode/viewModeReducer';
import { removeUndefinedOrEmptyString } from './utils';

export const RESTORE_STATE_FROM_URL_BEGIN = 'RESTORE_STATE_FROM_URL_BEGIN';
export const RESTORE_STATE_FROM_URL = 'RESTORE_STATE_FROM_URL';

const LATEST_QUERY_STRING_KEY = 'latestQueryString';

export function urlFromSessionStorageOrIndex() {
    const url = sessionStorage.getItem(LATEST_QUERY_STRING_KEY);
    return url ? `/${url}` : '/';
}

/**
 * Lagrer en queryString til sessionStorage, samt oppdaterer urlen i nettleserens adressefelt
 * slik at den viser denne queryStringen. Stringen lagres til sessionStorage for at brukeren
 * skal kunne navigere vekk fra stillingssøket uten å miste det siste foretatte søket, f.eks.
 * når en bruker klikker seg videre til annonsen på f.eks. Finn.no.
 * @param queryString   QueryStringen som skal lagres til sessionStorage.
 */
function setCurrentQueryString(queryString) {
    window.history.replaceState({}, '', queryString);
    sessionStorage.setItem(LATEST_QUERY_STRING_KEY, queryString);
}

function* updateUrl() {
    const state = yield select();
    const query = {
        q: state.searchBox.q,
        sort: state.sorting.sort,
        to: state.search.to > PAGE_SIZE ? state.search.to : undefined,
        counties: state.counties.checkedCounties,
        municipals: state.counties.checkedMunicipals,
        countries: state.countries.checkedCountries,
        published: state.published.checkedPublished,
        engagementType: state.engagement.checkedEngagementType,
        sector: state.sector.checkedSector,
        extent: state.extent.checkedExtent,
        occupationFirstLevels: state.occupations.checkedFirstLevels,
        occupationSecondLevels: state.occupations.checkedSecondLevels,
        saved: state.savedSearches.currentSavedSearch ? state.savedSearches.currentSavedSearch.uuid : undefined
    };
    const queryString = toQueryString(removeUndefinedOrEmptyString(query));

    setCurrentQueryString(queryString);
}

function* restoreStateFromUrl() {
    const searchString = document.location.search;
    setCurrentQueryString(searchString || '');

    if (searchString.length > 0) {
        yield put({ type: RESTORE_STATE_FROM_URL, query: toObject(searchString) });
    }
}

export const urlSaga = function* saga() {
    yield takeLatest([
        SEARCH,
        RESET_SEARCH,
        SET_CURRENT_SAVED_SEARCH,
        ADD_SAVED_SEARCH_SUCCESS,
        SET_VIEW_MODE,
        LOAD_MORE
    ], updateUrl);
    yield takeLatest(RESTORE_STATE_FROM_URL_BEGIN, restoreStateFromUrl);
};
