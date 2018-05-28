import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch,
    fetchTypeaheadSuggestions
} from './search/api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';

export const FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS = 'FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS';
export const FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS = 'FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS';

export const FETCH_INITIAL_HELTID_DELTID_SUCCESS = 'FETCH_INITIAL_HELTID_DELTID_SUCCESS';
export const FETCH_HELTID_DELTID_COUNT_SUCCESS = 'FETCH_HELTID_DELTID_COUNT_SUCCESS';

export const FETCH_INITIAL_COUNTIES_SUCCESS = 'FETCH_INITIAL_COUNTIES_SUCCESS';
export const FETCH_COUNTIES_COUNT_SUCCESS = 'FETCH_COUNTIES_COUNT_SUCCESS';

export const FETCH_INITIAL_SECTOR_SUCCESS = 'FETCH_INITIAL_SECTOR_SUCCESS';
export const FETCH_SECTOR_COUNT_SUCCESS = 'FETCH_SECTOR_COUNT_SUCCESS';

export const SET_TYPE_AHEAD_VALUE = 'SET_TYPE_AHEAD_VALUE';
export const SELECT_TYPE_AHEAD_VALUE = 'SELECT_TYPE_AHEAD_TOKEN';
export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE';

export const SET_SORTING = 'SET_SORTING';

export const INCREASE_PAGINATION_FROM = 'INCREASE_PAGINATION_FROM';
export const DECREASE_PAGINATION_FROM = 'DECREASE_PAGINATION_FROM';

export const CHECK_ENGAGEMENT_TYPE = 'CHECK_ENGAGEMENT_TYPE';
export const UNCHECK_ENGAGEMENT_TYPE = 'UNCHECK_ENGAGEMENT_TYPE';

export const CHECK_HELTID_DELTID = 'CHECK_HELTID_DELTID';
export const UNCHECK_HELTID_DELTID = 'UNCHECK_HELTID_DELTID';

export const CHECK_COUNTY = 'CHECK_COUNTY';
export const UNCHECK_COUNTY = 'UNCHECK_COUNTY';
export const CHECK_MUNICIPAL = 'CHECK_MUNICIPAL';
export const UNCHECK_MUNICIPAL = 'UNCHECK_MUNICIPAL';

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    heltidDeltid: [],
    counties: [],
    engagementType: [],
    sector: [],
    searchResult: {
        total: 0
    },
    query: {
        q: '',
        sort: '',
        from: 0,
        counties: [],
        municipals: [],
        heltidDeltid: [],
        engagementType: [],
        sector: []
    },
    isSearching: true,
    isAtLeastOneSearchDone: false,
    typeAheadSuggestions: [],
    cachedTypeAheadSuggestions: [],
    error: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                isAtLeastOneSearchDone: true,
                searchResult: action.response
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };
        case FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS:
            return {
                ...state,
                engagementType: action.response
            };
        case FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS:
            return {
                ...state,
                engagementType: state.engagementType.map((item) => {
                    const found = action.response.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case FETCH_INITIAL_HELTID_DELTID_SUCCESS:
            return {
                ...state,
                heltidDeltid: action.response
            };
        case FETCH_HELTID_DELTID_COUNT_SUCCESS:
            return {
                ...state,
                heltidDeltid: state.heltidDeltid.map((item) => {
                    const found = action.response.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case FETCH_INITIAL_COUNTIES_SUCCESS:
            return {
                ...state,
                counties: action.response
            };
        case FETCH_COUNTIES_COUNT_SUCCESS:
            return {
                ...state,
                counties: state.counties.map((county) => {
                    const foundCounty = action.response.find((c) => (
                        c.key === county.key
                    ));
                    return {
                        ...county,
                        count: foundCounty ? foundCounty.count : 0,
                        municipals: county.municipals.map((municipal) => {
                            let newMunicipalCount = 0;
                            if (foundCounty) {
                                const foundMunicipal = foundCounty.municipals.find((m) => (
                                    m.key === municipal.key
                                ));
                                newMunicipalCount = foundMunicipal ? foundMunicipal.count : 0;
                            }
                            return {
                                ...municipal,
                                count: newMunicipalCount
                            };
                        })
                    };
                })
            };
        case FETCH_INITIAL_SECTOR_SUCCESS:
            return {
                ...state,
                sector: action.response
            };
        case FETCH_SECTOR_COUNT_SUCCESS:
            return {
                ...state,
                sector: state.sector.map((item) => {
                    const found = action.response.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case SET_INITIAL_STATE:
            return {
                ...state,
                query: {
                    ...state.query,
                    ...action.query
                }

            };
        case SET_TYPE_AHEAD_VALUE:
            return {
                ...state,
                query: {
                    ...state.query,
                    q: action.value,
                    from: 0
                }
            };
        case SELECT_TYPE_AHEAD_VALUE:
            return {
                ...state,
                typeAheadSuggestions: []
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                typeAheadSuggestions: action.suggestions
            };
        case FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE:
            return {
                ...state,
                cachedTypeAheadSuggestions: action.cachedSuggestions
            };
        case SET_SORTING:
            return {
                ...state,
                query: {
                    ...state.query,
                    sort: action.sortField
                }
            };
        case INCREASE_PAGINATION_FROM:
            return {
                ...state,
                query: { ...state.query, from: state.query.from + 20 }
            };
        case DECREASE_PAGINATION_FROM:
            return {
                ...state,
                query: { ...state.query, from: state.query.from >= 20 ? state.query.from - 20 : 0 }
            };
        case CHECK_HELTID_DELTID:
            return {
                ...state,
                query: {
                    ...state.query,
                    heltidDeltid: [
                        ...state.query.heltidDeltid,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_HELTID_DELTID:
            return {
                ...state,
                query: {
                    ...state.query,
                    heltidDeltid: state.query.heltidDeltid.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        case CHECK_ENGAGEMENT_TYPE:
            return {
                ...state,
                query: {
                    ...state.query,
                    engagementType: [
                        ...state.query.engagementType,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_ENGAGEMENT_TYPE:
            return {
                ...state,
                query: {
                    ...state.query,
                    engagementType: state.query.engagementType.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        case CHECK_COUNTY:
            return {
                ...state,
                query: {
                    ...state.query,
                    counties: [
                        ...state.query.counties,
                        action.county
                    ],
                    from: 0
                }
            };
        case UNCHECK_COUNTY:
            const countyObject = state.counties.find((c) => c.key === action.county);
            return {
                ...state,
                query: {
                    ...state.query,
                    counties: state.query.counties.filter((c) => (c !== action.county)),
                    municipals: state.query.municipals ? state.query.municipals.filter((m1) =>
                        !countyObject.municipals.find((m) => m.key === m1)) : [],
                    from: 0
                }
            };
        case CHECK_MUNICIPAL:
            return {
                ...state,
                query: {
                    ...state.query,
                    municipals: [
                        ...state.query.municipals,
                        action.municipal
                    ],
                    from: 0
                }
            };
        case UNCHECK_MUNICIPAL:
            return {
                ...state,
                query: {
                    ...state.query,
                    municipals: state.query.municipals.filter((m) => (m !== action.municipal)),
                    from: 0
                }
            };
        case CHECK_SECTOR:
            return {
                ...state,
                query: {
                    ...state.query,
                    sector: [
                        ...state.query.sector,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_SECTOR:
            return {
                ...state,
                query: {
                    ...state.query,
                    sector: state.query.sector.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        default:
            return state;
    }
}

/** *********************************************************
 * SELECTORS
 ********************************************************* */
export const toSearchQuery = (state) => {
    const { query } = state;
    let searchQuery = { ...query };
    if (query.counties && query.municipals) {
        // Hvis man filtrerer på en kommune, må man droppe fylket når man søker.
        // Altså om man krysser av på Bergen, skal man ikke ha med Hordaland i søket.
        searchQuery = {
            ...searchQuery,
            counties: query.counties.filter((county) => {
                const countyObject = state.counties.find((c) => c.key === county);
                const found = countyObject.municipals.find((m) => query.municipals.includes(m.key));
                return !found;
            })
        };
    }
    return searchQuery;
};

/** *********************************************************
 * ASYNC ACTIONS
 ********************************************************* */
function* search() {
    try {
        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        const response = yield call(fetchSearch, toSearchQuery(state));

        yield put({ type: SEARCH_SUCCESS, response });

        yield put({ type: FETCH_COUNTIES_COUNT_SUCCESS, response: response.counties });
        yield put({ type: FETCH_HELTID_DELTID_COUNT_SUCCESS, response: response.heltidDeltid });
        yield put({ type: FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS, response: response.engagementTypes });
        yield put({ type: FETCH_SECTOR_COUNT_SUCCESS, response: response.sector });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* loadAvailableFacets(action) {
    try {
        if (Object.keys(action.query).length > 0) {
            yield put({ type: SET_INITIAL_STATE, query: action.query });
            const response = yield call(fetchSearch);
            yield put({ type: FETCH_INITIAL_COUNTIES_SUCCESS, response: response.counties });
            yield put({ type: FETCH_INITIAL_HELTID_DELTID_SUCCESS, response: response.heltidDeltid });
            yield put({ type: FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS, response: response.engagementTypes });
            yield put({ type: FETCH_INITIAL_SECTOR_SUCCESS, response: response.sector });
            yield call(search, action);
        } else {
            const response = yield call(fetchSearch);
            yield put({ type: SEARCH_SUCCESS, response });
            yield put({ type: FETCH_INITIAL_COUNTIES_SUCCESS, response: response.counties });
            yield put({ type: FETCH_INITIAL_HELTID_DELTID_SUCCESS, response: response.heltidDeltid });
            yield put({ type: FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS, response: response.engagementTypes });
            yield put({ type: FETCH_INITIAL_SECTOR_SUCCESS, response: response.sector });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* fetchTypeAheadSuggestions() {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const value = state.query.q;
    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state.cachedTypeAheadSuggestions.length === 0) {
            const cachedTypeAheadMatch = value.substring(0, TYPE_AHEAD_MIN_INPUT_LENGTH);
            try {
                const response = yield call(fetchTypeaheadSuggestions, cachedTypeAheadMatch);

                const suggestions = response.result.filter((cachedSuggestion) => (
                    cachedSuggestion.toLowerCase().startsWith(cachedTypeAheadMatch.toLowerCase())));
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: response.result });
                yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions });
            } catch (e) {
                if (e instanceof SearchApiError) {
                    yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE, error: e });
                } else {
                    throw e;
                }
            }
        } else {
            const suggestions = state.cachedTypeAheadSuggestions.filter((cachedSuggestion) => (
                cachedSuggestion.toLowerCase().startsWith(value.toLowerCase())));
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions });
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: [] });
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [] });
    }
}

export const saga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(INITIAL_SEARCH, loadAvailableFacets);
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
