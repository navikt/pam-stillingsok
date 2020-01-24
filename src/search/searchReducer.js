import {call, put, select, takeLatest, throttle} from 'redux-saga/effects';
import {fetchLocations, fetchSearch} from '../api/api';
import SearchApiError from '../api/SearchApiError';
import {RESTORE_STATE_FROM_SAVED_SEARCH} from '../savedSearches/savedSearchesReducer';
import {RESTORE_STATE_FROM_URL} from '../search/searchQueryReducer';
import {RESET_PAGINATION, toApiSearchQuery} from './searchQueryReducer';

export const FETCH_INITIAL_FACETS_SUCCESS = 'FETCH_INITIAL_FACETS_SUCCESS';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const RESET_SEARCH = 'RESET_SEARCH';
export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_END = 'SEARCH_END';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const LOAD_MORE = 'LOAD_MORE';
export const LOAD_MORE_BEGIN = 'LOAD_MORE_BEGIN';
export const LOAD_MORE_SUCCESS = 'LOAD_MORE_SUCCESS';

export const PAGE_SIZE = 50;

const initialState = {
    initialSearchDone: false,
    isSearching: true,
    isLoadingMore: false,
    searchResult: undefined,
    page: 0
};

export default function searchReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
            return {
                ...state,
                page: action.query.to ? (parseInt(action.query.to, 10) - PAGE_SIZE) / PAGE_SIZE : 0
            };
        case RESET_PAGINATION:
            return {
                ...state,
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
                    positioncount: action.response.positioncount,
                    stillinger: action.response.stillinger
                }
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false
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
                    stillinger: mergeAndRemoveDuplicates(state.searchResult.stillinger, action.response.stillinger)
                }
            };
        default:
            return state;
    }
}

/**
 * Når man laster inn flere annonser, kan en allerede lastet annonse komme på nytt. Dette kan f.eks skje
 * ved at annonser legges til/slettes i backend, noe som fører til at pagineringen og det faktiske datasettet
 * blir usynkronisert. Funskjonen fjerner derfor duplikate annonser i søkeresultatet.
 */
export function mergeAndRemoveDuplicates(stillingerAlreadyInMemory, stillingerFromBackend) {
    return [...stillingerAlreadyInMemory, ...stillingerFromBackend.filter((a) => {
        const duplicate = stillingerAlreadyInMemory.find((b) => (
            a.uuid === b.uuid
        ));
        return !duplicate;
    })];
}

/**
 * Fetcher alle tilgjengelige fasetter og gjør deretter det første søket.
 */
function* initialSearch() {
    yield put({type: SEARCH_BEGIN});
    let state = yield select();
    try {
        if (!state.search.initialSearchDone) {
            // For å få tak i alle tilgjengelige fasetter (yrke, område osv), så gjør vi først
            // et søk uten noen søkekriterier. Dette vil returnere alle kjente fasettverdier på
            // tverss av alle annonsene i backend. Vi henter også all geografi info fra server.
            let searchRes = yield call(fetchSearch, {});
            const locationRes = yield call(fetchLocations);

            if (typeof searchRes === 'object') searchRes['locations'] = locationRes;

            yield put({type: FETCH_INITIAL_FACETS_SUCCESS, response: searchRes});

            // Hvis bruker allerede har noen søkekriterier (f.eks fra en bokmerket lenke), så må vi
            // foreta et nytt søk med disse kriteriene.
            state = yield select();
            const query = toApiSearchQuery(state.searchQuery);
            if (Object.keys(query).length > 0) {
                searchRes = yield call(fetchSearch, query);
            }

            yield put({type: SEARCH_SUCCESS, response: searchRes});
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({type: SEARCH_FAILURE, error: e});
        } else {
            throw e;
        }
    }
    yield put({type: SEARCH_END});
}

function* search() {
    yield put({type: SEARCH_BEGIN});
    try {
        yield put({type: RESET_PAGINATION});
        const state = yield select();
        const query = toApiSearchQuery(state.searchQuery);
        const searchResult = yield call(fetchSearch, query);
        yield put({type: SEARCH_SUCCESS, response: searchResult});
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({type: SEARCH_FAILURE, error: e});
        } else {
            throw e;
        }
    }
    yield put({type: SEARCH_END});
}

function* loadMore() {
    try {
        const state = yield select();
        yield put({type: LOAD_MORE_BEGIN});
        const response = yield call(fetchSearch, toApiSearchQuery(state.searchQuery));
        yield put({type: LOAD_MORE_SUCCESS, response});
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({type: SEARCH_FAILURE, error: e});
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
