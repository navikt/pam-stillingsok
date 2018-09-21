import { select, call, put, takeLatest, throttle } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch
} from '../api/api';
import { fromUrl, toUrl, ParameterType } from './url';

export const RESTORE_PREVIOUS_SEARCH = 'RESTORE_PREVIOUS_SEARCH';
export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const FETCH_INITIAL_FACETS_SUCCESS = 'FETCH_INITIAL_FACETS_SUCCESS';
export const SEARCH = 'SEARCH';
export const RESET_SEARCH = 'RESET_SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_END = 'SEARCH_END';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const REMEMBER_SEARCH = 'REMEMBER_SEARCH';
export const RESET_FROM = 'RESET_FROM';
export const LOAD_MORE = 'LOAD_MORE';
export const LOAD_MORE_BEGIN = 'LOAD_MORE_BEGIN';
export const LOAD_MORE_SUCCESS = 'LOAD_MORE_SUCCESS';
export const SET_MODE = 'SET_MODE';

export const PAGE_SIZE = 50;

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
    mode: ParameterType.STRING
};

const initialState = {
    isAtLeastOneSearchDone: false,
    initialSearchDone: false,
    isSearching: true,
    isLoadingMore: false,
    searchResult: {
        total: 0
    },
    hasError: false,
    from: 0,
    to: PAGE_SIZE,
    page: 0,
    mode: 'normal',
    url: undefined
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
        case SET_INITIAL_STATE:
            return {
                ...state,
                hasRestoredPreviousSearch: true,
                from: 0,
                to: action.query.to || PAGE_SIZE,
                page: action.query.to ? (action.query.to - PAGE_SIZE) / PAGE_SIZE : 0,
                mode: action.query.mode ? action.query.mode : 'normal',
                url: action.url
            };
        case RESET_FROM:
            return {
                ...state,
                from: 0,
                to: PAGE_SIZE,
                page: 0
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
                isAtLeastOneSearchDone: true,
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
        case SET_MODE:
            return {
                ...state,
                mode: action.mode
            };
        default:
            return state;
    }
}

export function toSearchQuery(state) {
    return {
        q: state.searchBox.q,
        from: state.search.from,
        size: state.search.to - state.search.from,
        sort: state.sorting.sort,
        counties: state.counties.checkedCounties.filter((county) => {
            // Hvis man filtrerer på en kommune, må man droppe fylket når man søker.
            // Altså om man krysser av på Bergen, skal man ikke ha med Hordaland i søket.
            const countyObject = state.counties.counties.find((c) => c.key === county);
            const found = countyObject.municipals.find((m) => state.counties.checkedMunicipals.includes(m.key));
            return !found;
        }),
        municipals: state.counties.checkedMunicipals,
        published: state.published.checkedPublished,
        engagementType: state.engagement.checkedEngagementType,
        sector: state.sector.checkedSector,
        extent: state.extent.checkedExtent,
        occupationFirstLevels: state.occupations.checkedFirstLevels.filter((firstLevel) => {
            // Hvis man filtrerer på en yrke på andre nivå, må man droppe yrkeskategorien på første nivå.
            const firstLevelObject = state.occupations.occupationFirstLevels.find((c) => c.key === firstLevel);
            const found = firstLevelObject.occupationSecondLevels.find((m) => state.occupations.checkedSecondLevels.includes(m.key));
            return !found;
        }),
        occupationSecondLevels: state.occupations.checkedSecondLevels
    };
}


export function toQuery(state) {
    return {
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
        occupationSecondLevels: state.occupations.checkedSecondLevels
    };
}


function* updateUrlParams() {
    const state = yield select();
    try {
        const url = toUrl(toQuery(state));
        if (url && url.length > 0) {
            sessionStorage.setItem('url', url);
        } else {
            sessionStorage.removeItem('url');
        }
    } catch (e) {
        // Ignore session storage error
    }
}

function getUrlParams() {
    let url;
    try {
        url = sessionStorage.getItem('url');
    } catch (e) {
        // Ignore session storage error
    }
    return url === null ? undefined : url;
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
            // For å hente alle tilgjengelige fasetter, gjør vi først
            // et søk uten noen søkekriterier.
            response = yield call(fetchSearch, { size: PAGE_SIZE });
            yield put({ type: FETCH_INITIAL_FACETS_SUCCESS, response });
        }

        // Gjør eventuelt et nytt søk med søkekriterier fra url
        const url = getUrlParams();
        if (url && url !== state.search.url) {
            yield put({
                type: SET_INITIAL_STATE,
                query: fromUrl(SEARCH_PARAMETERS_DEFINITION, url),
                url
            });
            state = yield select();
            const query = toSearchQuery(state);
            if (Object.keys(query).length > 0) {
                response = yield call(fetchSearch, query);
            }
        }

        if (response) {
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
        yield updateUrlParams();
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

function* resetSearch() {
    yield put({
        type: SET_INITIAL_STATE,
        query: {},
        url: ''
    });
    yield search();
}

export const saga = function* saga() {
    yield takeLatest(REMEMBER_SEARCH, updateUrlParams);
    yield takeLatest(INITIAL_SEARCH, initialSearch);
    yield throttle(1000, SEARCH, search);
    yield takeLatest(LOAD_MORE, loadMore);
    yield takeLatest(RESET_SEARCH, resetSearch);
};
