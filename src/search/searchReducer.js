import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch
} from '../api/api';

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
export const RESET_PAGE = 'RESET_PAGE';
export const KEEP_SCROLL_POSITION = 'KEEP_SCROLL_POSITION';

export const PAGE_SIZE = 20;

const initialState = {
    isAtLeastOneSearchDone: false,
    isSearching: true,
    isLoadingMore: false,
    searchResult: {
        total: 0
    },
    hasError: false,
    from: 0
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                from: action.query.from || 0
            };
        case RESET_FROM:
            return {
                ...state,
                from: 0
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
                    stillinger: [action.response.stillinger]
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
                from: state.from + PAGE_SIZE
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
                searchResult: {
                    ...state.searchResult,
                    stillinger: [...state.searchResult.stillinger, action.response.stillinger]
                }
            };
        case RESET_PAGE: {
            return {
                ...state,
                from: 0
            };
        }
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

export function toUrlQuery(state) {
    const urlQuery = {};
    if (state.searchBox.q) urlQuery.q = state.searchBox.q;
    if (state.sorting.sort) urlQuery.sort = state.sorting.sort;
    if (state.search.from) urlQuery.from = state.search.from;
    if (state.counties.checkedCounties.length > 0) urlQuery.counties = state.counties.checkedCounties.join('_');
    if (state.counties.checkedMunicipals.length > 0) urlQuery.municipals = state.counties.checkedMunicipals.join('_');
    if (state.created.checkedCreated.length > 0) urlQuery.created = state.created.checkedCreated.join('_');
    if (state.engagement.checkedEngagementType.length > 0) {
        urlQuery.engagementType = state.engagement.checkedEngagementType.join('_');
    }
    if (state.sector.checkedSector.length > 0) urlQuery.sector = state.sector.checkedSector.join('_');
    if (state.extent.checkedExtent.length > 0) urlQuery.extent = state.extent.checkedExtent.join('_');
    return Object.keys(urlQuery)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlQuery[key])}`)
        .join('&')
        .replace(/%20/g, '+');
}

export function updateBrowserUrl(state) {
    const urlQuery = toUrlQuery(state);
    const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
    window.history.replaceState('', '', newUrlQuery);
}


export function getUrlParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export function fromUrlQuery(url) {
    const stateFromUrl = {};
    const q = getUrlParameterByName('q', url);
    const from = getUrlParameterByName('from', url);
    const sort = getUrlParameterByName('sort', url);
    const counties = getUrlParameterByName('counties', url);
    const municipals = getUrlParameterByName('municipals', url);
    const extent = getUrlParameterByName('extent', url);
    const engagementType = getUrlParameterByName('engagementType', url);
    const sector = getUrlParameterByName('sector', url);
    const created = getUrlParameterByName('created', url);

    if (q) stateFromUrl.q = q;
    if (from) stateFromUrl.from = parseInt(from, 10);
    if (sort) stateFromUrl.sort = sort;
    if (counties) stateFromUrl.counties = counties.split('_');
    if (municipals) stateFromUrl.municipals = municipals.split('_');
    if (extent) stateFromUrl.extent = extent.split('_');
    if (engagementType) stateFromUrl.engagementType = engagementType.split('_');
    if (sector) stateFromUrl.sector = sector.split('_');
    if (created) stateFromUrl.created = created.split('_');
    return stateFromUrl;
}

export function toSearchQuery(state) {
    return {
        q: state.searchBox.q,
        from: state.search.from,
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

/**
 * Henter ut search query fra browser url første gang siden blir lastet.
 * Fetcher alle tilgjengelige fasetter og gjør deretter det første søket.
 */
function* initialSearch() {
    let state = yield select();
    if (!state.search.initialSearchDone) {
        try {
            const urlQuery = fromUrlQuery(window.location.href);
            yield put({ type: SET_INITIAL_STATE, query: urlQuery });

            // Får å hente alle tilgjengelige fasetter, gjøre vi først
            // et søk uten noen søkekriterier.
            yield put({ type: SEARCH_BEGIN });
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
        updateBrowserUrl(state);
        yield put({ type: SEARCH_BEGIN });
        const searchResult = yield call(fetchSearch, toSearchQuery(state));
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
        updateBrowserUrl(state);
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
    yield takeLatest(SEARCH, search);
    yield takeLatest(LOAD_MORE, loadMore);
};
