import { select, call, put, takeLatest, throttle } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch
} from '../api/api';
import { fromUrl, toUrl, ParameterType } from './url';

export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const FETCH_INITIAL_FACETS_SUCCESS = 'FETCH_INITIAL_FACETS_SUCCESS';
export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const RESET_FROM = 'RESET_FROM';
export const LOAD_MORE = 'LOAD_MORE';
export const LOAD_MORE_BEGIN = 'LOAD_MORE_BEGIN';
export const LOAD_MORE_SUCCESS = 'LOAD_MORE_SUCCESS';
export const KEEP_SCROLL_POSITION = 'KEEP_SCROLL_POSITION';

export const PAGE_SIZE = 20;

export const URL_PARAMETERS_DEFINITION = {
    q: ParameterType.STRING,
    sort: ParameterType.STRING,
    to: ParameterType.NUMBER,
    counties: ParameterType.ARRAY,
    municipals: ParameterType.ARRAY,
    created: ParameterType.ARRAY,
    engagementType: ParameterType.ARRAY,
    sector: ParameterType.ARRAY,
    extent: ParameterType.ARRAY
};

const initialState = {
    isAtLeastOneSearchDone: false,
    isSearching: true,
    isLoadingMore: false,
    searchResult: {
        total: 0
    },
    hasError: false,
    from: 0,
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
        case SET_INITIAL_STATE:
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
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                initialSearchDone: true,
                isAtLeastOneSearchDone: true,
                searchResult: {
                    ...action.response,
                    stillinger: action.response.stillinger
                }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
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
        case KEEP_SCROLL_POSITION: {
            return {
                ...state,
                scrollPosition: action.scrollPosition
            };
        }
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
        created: state.created.checkedCreated,
        engagementType: state.engagement.checkedEngagementType,
        sector: state.sector.checkedSector,
        extent: state.extent.checkedExtent
    };
}

export function toUrlQuery(state) {
    return {
        q: state.searchBox.q,
        sort: state.sorting.sort,
        to: state.search.to > PAGE_SIZE ? state.search.to : undefined,
        counties: state.counties.checkedCounties,
        municipals: state.counties.checkedMunicipals,
        created: state.created.checkedCreated,
        engagementType: state.engagement.checkedEngagementType,
        sector: state.sector.checkedSector,
        extent: state.extent.checkedExtent
    };
}

/**
 * Henter ut search query fra browser url første gang siden blir lastet.
 * Fetcher alle tilgjengelige fasetter og gjør deretter det første søket.
 */
function* initialSearch() {
    let state = yield select();
    if (!state.search.initialSearchDone) {
        try {
            const urlQuery = fromUrl(URL_PARAMETERS_DEFINITION, window.location.href);

            yield put({ type: SET_INITIAL_STATE, query: urlQuery });

            // Får å hente alle tilgjengelige fasetter, gjøre vi først
            // et søk uten noen søkekriterier.
            yield put({ type: SEARCH_BEGIN, query: {} });
            let response = yield call(fetchSearch);
            yield put({ type: FETCH_INITIAL_FACETS_SUCCESS, response });

            if (Object.keys(urlQuery).length > 0) {
                state = yield select();
                response = yield call(fetchSearch, toSearchQuery(state));
            }

            yield put({ type: SEARCH_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: SEARCH_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* search() {
    try {
        yield put({ type: RESET_FROM });
        const state = yield select();
        const query = toSearchQuery(state);
        window.history.replaceState('', '', toUrl(toUrlQuery(state)) || window.location.pathname);
        yield put({ type: SEARCH_BEGIN, query });
        const searchResult = yield call(fetchSearch, query);
        yield put({ type: SEARCH_SUCCESS, response: searchResult });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* loadMore() {
    try {
        const state = yield select();
        window.history.replaceState('', '', toUrl(toUrlQuery(state)) || window.location.pathname);
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
    yield throttle(1000, SEARCH, search);
    yield takeLatest(LOAD_MORE, loadMore);
};
