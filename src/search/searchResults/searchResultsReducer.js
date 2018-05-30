import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch
} from '../../api/api';
import {
    FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS,
    FETCH_HELTID_DELTID_COUNT_SUCCESS, FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS,
    FETCH_INITIAL_HELTID_DELTID_SUCCESS, FETCH_INITIAL_SECTOR_SUCCESS,
    FETCH_SECTOR_COUNT_SUCCESS, SET_INITIAL_STATE
} from '../domene';

export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const INITIAL_SEARCH_SUCCESS = 'INITIAL_SEARCH_SUCCESS';
export const INITIAL_SEARCH_DONE = 'INITIAL_SEARCH_DONE';
export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';

const initialState = {
    searchResult: {
        total: 0
    },
    initialSearchDone: false,
    isSearching: true,
    isAtLeastOneSearchDone: false,
    error: undefined
};

export default function searchResultsReducer(state = initialState, action) {
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
        default:
            return state;
    }
}

export const toSearchQuery = (state) => {
    return {
        ...state.reducer.query,
        from: state.pagination.from,
        sort: state.sorting.sort,
        counties: state.counties.checkedCounties.filter((county) => {
            // Hvis man filtrerer på en kommune, må man droppe fylket når man søker.
            // Altså om man krysser av på Bergen, skal man ikke ha med Hordaland i søket.
            const countyObject = state.counties.counties.find((c) => c.key === county);
            const found = countyObject.municipals.find((m) => state.counties.checkedMunicipals.includes(m.key));
            return !found;
        }),
        municipals: state.counties.checkedMunicipals,
        created: state.created.checkedCreated
    };
};

export const toUrlQuery = (state) => {
    const urlQuery = {};
    const { query } = state.reducer;

    if (query.q) urlQuery.q = query.q;
    if (state.sorting.sort) urlQuery.sort = state.sorting.sort;
    if (state.pagination.from) urlQuery.from = state.pagination.from;
    if (state.counties.checkedCounties.length > 0) urlQuery.counties = state.counties.checkedCounties.join('_');
    if (state.counties.checkedMunicipals.length > 0) urlQuery.municipals = state.counties.checkedMunicipals.join('_');
    if (state.created.checkedCreated.length > 0) urlQuery.created = state.created.checkedCreated.join('_');
    if (query.heltidDeltid && query.heltidDeltid.length > 0) urlQuery.heltidDeltid = query.heltidDeltid.join('_');
    if (query.engagementType && query.engagementType.length > 0) urlQuery.engagementType = query.engagementType.join('_');
    if (query.sector && query.sector.length > 0) urlQuery.sector = query.sector.join('_');

    return Object.keys(urlQuery)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlQuery[key])}`)
        .join('&')
        .replace(/%20/g, '+');
};

function* search() {
    try {
        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        // Update browser url to reflect current search query
        const urlQuery = toUrlQuery(state);
        const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
        window.history.replaceState('', '', newUrlQuery);

        const response = yield call(fetchSearch, toSearchQuery(state));

        yield put({ type: SEARCH_SUCCESS, response });

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
                yield call(search, action);
            } else {
                const response = yield call(fetchSearch);
                yield put({ type: SEARCH_SUCCESS, response });
                yield put({ type: INITIAL_SEARCH_SUCCESS, response });
                yield put({ type: FETCH_INITIAL_HELTID_DELTID_SUCCESS, response: response.heltidDeltid });
                yield put({ type: FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS, response: response.engagementTypes });
                yield put({ type: FETCH_INITIAL_SECTOR_SUCCESS, response: response.sector });
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

export const searchResultsSaga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(INITIAL_SEARCH, initialSearch);
};

