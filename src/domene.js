import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch,
    fetchTypeaheadSuggestions
} from './search/api';

/** *********************************************************
 * ACTIONS
 ********************************************************* */

export const INITIAL_SEARCH_SUCCESS = 'INITIAL_SEARCH_SUCCESS';

export const INITIAL_SEARCH_DONE = 'INITIAL_SEARCH_DONE';
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

export const FETCH_INITIAL_SECTOR_SUCCESS = 'FETCH_INITIAL_SECTOR_SUCCESS';
export const FETCH_SECTOR_COUNT_SUCCESS = 'FETCH_SECTOR_COUNT_SUCCESS';

export const FETCH_INITIAL_CREATED_SUCCESS = 'FETCH_INITIAL_CREATED_SUCCESS';
export const FETCH_CREATED_COUNT_SUCCESS = 'FETCH_CREATED_COUNT_SUCCESS';

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

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';

export const CHECK_CREATED = 'CHECK_CREATED';
export const UNCHECK_CREATED = 'UNCHECK_CREATED';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    heltidDeltid: [],
    counties: [],
    engagementType: [],
    sector: [],
    created: [],
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
        sector: [],
        created: []
    },
    initialSearchDone: false,
    isSearching: true,
    isAtLeastOneSearchDone: false,
    typeAheadSuggestions: [],
    cachedTypeAheadSuggestions: [],
    error: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case INITIAL_SEARCH_DONE:
            return {
                ...state,
                initialSearchDone: true
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
        case FETCH_INITIAL_CREATED_SUCCESS:
            return {
                ...state,
                created: action.response
            };
        case FETCH_CREATED_COUNT_SUCCESS:
            return {
                ...state,
                created: state.created.map((item) => {
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
        case CHECK_CREATED:
            return {
                ...state,
                query: {
                    ...state.query,
                    created: [
                        ...state.query.created,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_CREATED:
            return {
                ...state,
                query: {
                    ...state.query,
                    created: state.query.created.filter((e) => (e !== action.value)),
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
    const { query } = state.search;
    const { counties, checkedCounties, checkedMunicipals } = state.counties;
    let searchQuery = { ...query };
    if (checkedCounties && checkedMunicipals) {
        // Hvis man filtrerer på en kommune, må man droppe fylket når man søker.
        // Altså om man krysser av på Bergen, skal man ikke ha med Hordaland i søket.
        searchQuery = {
            ...searchQuery,
            counties: checkedCounties.filter((county) => {
                const countyObject = counties.find((c) => c.key === county);
                const found = countyObject.municipals.find((m) => checkedMunicipals.includes(m.key));
                return !found;
            }),
            municipals: [...checkedMunicipals]
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
        yield put({ type: FETCH_HELTID_DELTID_COUNT_SUCCESS, response: response.heltidDeltid });
        yield put({ type: FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS, response: response.engagementTypes });
        yield put({ type: FETCH_SECTOR_COUNT_SUCCESS, response: response.sector });
        yield put({ type: FETCH_CREATED_COUNT_SUCCESS, response: response.created });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* initialSearch(action) {
    const state = yield select();
    if (!state.initialSearchDone) {
        try {
            if (Object.keys(action.query).length > 0) {
                yield put({ type: SET_INITIAL_STATE, query: action.query });
                const response = yield call(fetchSearch);
                yield put({ type: INITIAL_SEARCH_SUCCESS, response });
                yield put({ type: FETCH_INITIAL_HELTID_DELTID_SUCCESS, response: response.heltidDeltid });
                yield put({ type: FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS, response: response.engagementTypes });
                yield put({ type: FETCH_INITIAL_SECTOR_SUCCESS, response: response.sector });
                yield put({ type: FETCH_INITIAL_CREATED_SUCCESS, response: response.created });
                yield call(search, action);
            } else {
                const response = yield call(fetchSearch);
                yield put({ type: SEARCH_SUCCESS, response });
                yield put({ type: INITIAL_SEARCH_SUCCESS, response });
                yield put({ type: FETCH_INITIAL_HELTID_DELTID_SUCCESS, response: response.heltidDeltid });
                yield put({ type: FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS, response: response.engagementTypes });
                yield put({ type: FETCH_INITIAL_SECTOR_SUCCESS, response: response.sector });
                yield put({ type: FETCH_INITIAL_CREATED_SUCCESS, response: response.created });
            }
            yield put({ type: INITIAL_SEARCH_DONE });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: SEARCH_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* fetchTypeAheadSuggestions() {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const value = state.search.query.q;
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
    yield takeLatest(INITIAL_SEARCH, initialSearch);
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
