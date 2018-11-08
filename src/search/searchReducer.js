import { call, put, select, takeLatest, throttle } from 'redux-saga/effects';
import { fetchSearch } from '../api/api';
import SearchApiError from '../api/SearchApiError';
import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../urlReducer';

export const FETCH_INITIAL_FACETS_SUCCESS = 'FETCH_INITIAL_FACETS_SUCCESS';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const RESET_SEARCH = 'RESET_SEARCH';
export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_END = 'SEARCH_END';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const RESET_FROM = 'RESET_FROM';
export const LOAD_MORE = 'LOAD_MORE';
export const LOAD_MORE_BEGIN = 'LOAD_MORE_BEGIN';
export const LOAD_MORE_SUCCESS = 'LOAD_MORE_SUCCESS';

export const PAGE_SIZE = 50;

const initialState = {
    initialSearchDone: false,
    isSearching: true,
    isLoadingMore: false,
    searchResult: undefined,
    hasError: false,
    from: 0,
    to: PAGE_SIZE,
    page: 0
};

export function mergeAndRemoveDuplicates(array1, array2) {
    return [...array1, ...array2.filter((a) => {
        const duplicate = array1.find((b) => (
            a.uuid === b.uuid
        ));
        return !duplicate;
    })];
}

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
            return {
                ...state,
                from: 0,
                to: action.query.to || PAGE_SIZE,
                page: action.query.to ? (action.query.to - PAGE_SIZE) / PAGE_SIZE : 0
            };
        case RESET_FROM:
            return {
                ...state,
                from: 0,
                to: PAGE_SIZE,
                page: 0
            };
        case RESTORE_STATE_FROM_SAVED_SEARCH:
        case RESET_SEARCH:
            return {
                ...state,
                searchResult: undefined
            };
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_END:
            return {
                ...state,
                isSearching: false
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                initialSearchDone: true,
                searchResult: {
                    total: action.response.total,
                    stillinger: action.response.stillinger
                }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                hasError: true,
                error: action.error
            };
        case LOAD_MORE:
            return {
                ...state,
                from: state.to,
                to: state.to + PAGE_SIZE
            };
        case LOAD_MORE_BEGIN:
            return {
                ...state,
                isLoadingMore: true
            };
        case LOAD_MORE_SUCCESS:
            return {
                ...state,
                isLoadingMore: false,
                page: state.page + 1,
                searchResult: {
                    ...state.searchResult,
                    // Når man pager kan en allerede lastet annonse komme på nytt på neste page.
                    stillinger: mergeAndRemoveDuplicates(state.searchResult.stillinger, action.response.stillinger)
                }
            };
        default:
            return state;
    }
}

export function toSearchQuery(state) {
    const query = {};
    if (state.searchBox.q.length > 0) query.q = state.searchBox.q;
    if (state.search.from > 0) query.from = state.search.from;
    if (state.search.to > PAGE_SIZE) query.size = state.search.to - state.search.from;
    if (state.sorting.sort.length > 0) query.sort = state.sorting.sort;
    if (state.counties.checkedCounties.length > 0) query.counties = state.counties.checkedCounties;
    if (state.counties.checkedMunicipals.length > 0) query.municipals = state.counties.checkedMunicipals;
    if (state.published.checkedPublished.length > 0) query.published = state.published.checkedPublished;
    if (state.engagement.checkedEngagementType.length > 0) query.engagementType = state.engagement.checkedEngagementType;
    if (state.sector.checkedSector.length > 0) query.sector = state.sector.checkedSector;
    if (state.extent.checkedExtent.length > 0) query.extent = state.extent.checkedExtent;
    if (state.occupations.checkedFirstLevels.length > 0) query.occupationFirstLevels = state.occupations.checkedFirstLevels;
    if (state.occupations.checkedSecondLevels.length > 0) query.occupationSecondLevels = state.occupations.checkedSecondLevels;
    return query;
}

/**
 * Fetcher alle tilgjengelige fasetter og gjør deretter det første søket.
 */
function* initialSearch() {
    yield put({ type: SEARCH_BEGIN });
    let state = yield select();
    try {
        let response;
        if (!state.search.initialSearchDone) {
            // For å hente alle tilgjengelige fasetter (yrke, sted ), gjør vi først
            // et søk uten noen søkekriterier.
            response = yield call(fetchSearch, {});
            yield put({ type: FETCH_INITIAL_FACETS_SUCCESS, response });

            // Gjør et nytt søk hvis det finnes noen krysset av noen
            // fasetter/søkekriterier
            state = yield select();
            const query = toSearchQuery(state);
            if (Object.keys(query).length > 0) {
                response = yield call(fetchSearch, query);
            }

            yield put({ type: SEARCH_SUCCESS, response });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
    yield put({ type: SEARCH_END });
}

function* search() {
    yield put({ type: SEARCH_BEGIN });
    try {
        yield put({ type: RESET_FROM });
        const state = yield select();
        const query = toSearchQuery(state);
        const searchResult = yield call(fetchSearch, query);
        yield put({ type: SEARCH_SUCCESS, response: searchResult });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
    yield put({ type: SEARCH_END });
}

function* loadMore() {
    try {
        const state = yield select();
        yield put({ type: LOAD_MORE_BEGIN });
        const response = yield call(fetchSearch, toSearchQuery(state));
        yield put({ type: LOAD_MORE_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const saga = function* saga() {
    yield takeLatest(INITIAL_SEARCH, initialSearch);
    yield takeLatest(RESET_SEARCH, search);
    yield throttle(1000, SEARCH, search);
    yield takeLatest(LOAD_MORE, loadMore);
};
