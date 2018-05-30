import { select, call, put, takeLatest } from 'redux-saga/effects';
import {
    SearchApiError,
    fetchSearch
} from '../api/api';
import { RESET_PAGE } from './pagination/paginationReducer';

export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';
export const INITIAL_SEARCH = 'INITIAL_SEARCH';
export const INITIAL_SEARCH_SUCCESS = 'INITIAL_SEARCH_SUCCESS';
export const INITIAL_SEARCH_DONE = 'INITIAL_SEARCH_DONE';
export const SEARCH = 'SEARCH';
export const SEARCH_BEGIN = 'SEARCH_BEGIN';
export const SEARCH_SUCCESS = 'SEARCH_SUCCESS';
export const SEARCH_FAILURE = 'SEARCH_FAILURE';
export const PAGINATE = 'PAGINATE';

export const toSearchQuery = (state) => ({
    q: state.searchBox.q,
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
    created: state.created.checkedCreated,
    engagementType: state.engagement.checkedEngagementType,
    sector: state.sector.checkedSector,
    extent: state.extent.checkedExtent
});

export const toUrlQuery = (state) => {
    const urlQuery = {};

    if (state.searchBox.q) urlQuery.q = state.searchBox.q;
    if (state.sorting.sort) urlQuery.sort = state.sorting.sort;
    if (state.pagination.from) urlQuery.from = state.pagination.from;
    if (state.counties.checkedCounties.length > 0) urlQuery.counties = state.counties.checkedCounties.join('_');
    if (state.counties.checkedMunicipals.length > 0) urlQuery.municipals = state.counties.checkedMunicipals.join('_');
    if (state.created.checkedCreated.length > 0) urlQuery.created = state.created.checkedCreated.join('_');
    if (state.engagement.checkedEngagementType.length > 0) urlQuery.engagementType = state.engagement.checkedEngagementType.join('_');
    if (state.sector.checkedSector.length > 0) urlQuery.sector = state.sector.checkedSector.join('_');
    if (state.extent.checkedExtent.length > 0) urlQuery.heltidDeltid = state.extent.checkedExtent.join('_');

    return Object.keys(urlQuery)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(urlQuery[key])}`)
        .join('&')
        .replace(/%20/g, '+');
};

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
};

function* search(action, resetPage = true) {
    try {
        if (resetPage) {
            yield put({ type: RESET_PAGE });
        }

        yield put({ type: SEARCH_BEGIN });
        const state = yield select();

        // Update browser url to reflect current search query
        const urlQuery = toUrlQuery(state);
        const newUrlQuery = urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : window.location.pathname;
        window.history.replaceState('', '', newUrlQuery);

        const response = yield call(fetchSearch, toSearchQuery(state));

        yield put({ type: SEARCH_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* paginate(action) {
    yield search(action, false);
}

function* initialSearch(action) {
    const state = yield select();
    if (!state.initialSearchDone) {
        try {
            const urlQuery = fromUrlQuery(window.location.href);
            if (Object.keys(urlQuery).length > 0) {
                yield put({ type: SET_INITIAL_STATE, query: urlQuery });
                const response = yield call(fetchSearch);
                yield put({ type: INITIAL_SEARCH_SUCCESS, response });
                yield call(search, action, false);
            } else {
                const response = yield call(fetchSearch);
                yield put({ type: SEARCH_SUCCESS, response });
                yield put({ type: INITIAL_SEARCH_SUCCESS, response });
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

export const saga = function* saga() {
    yield takeLatest(SEARCH, search);
    yield takeLatest(PAGINATE, paginate);
    yield takeLatest(INITIAL_SEARCH, initialSearch);
};
