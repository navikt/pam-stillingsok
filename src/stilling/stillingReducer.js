import { call, put, takeLatest, select } from 'redux-saga/effects';
import { fetchStilling, SearchApiError } from '../api/api';

export const FETCH_STILLING_BEGIN = 'FETCH_STILLING_BEGIN';
export const FETCH_STILLING_SUCCESS = 'FETCH_STILLING_SUCCESS';
export const FETCH_STILLING_FAILURE = 'FETCH_STILLING_FAILURE';
export const FOUND_CACHED_STILLING = 'FOUND_CACHED_STILLING';

const initialState = {
    stilling: undefined,
    error: undefined,
    cachedStilling: undefined
};

export default function stillingReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_STILLING_BEGIN:
            return {
                ...state,
                stilling: undefined,
                isFetchingStilling: true,
                error: undefined
            };
        case FETCH_STILLING_SUCCESS:
            return {
                ...state,
                stilling: action.response,
                isFetchingStilling: false
            };
        case FETCH_STILLING_FAILURE:
            return {
                ...state,
                error: action.error,
                isFetchingStilling: false
            };
        case FOUND_CACHED_STILLING:
            return {
                ...state,
                cachedStilling: action.found
            };
        default:
            return state;
    }
}

function* getStilling(action) {
    try {
        const state = yield select();

        const found = state.search.searchResult.stillinger ? state.search.searchResult.stillinger.find((stilling) => (
            stilling.uuid === action.uuid
        )) : undefined;

        if (found) {
            yield put({ type: FOUND_CACHED_STILLING, found });
        }

        const response = yield call(fetchStilling, action.uuid);
        yield put({ type: FETCH_STILLING_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_STILLING_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const stillingSaga = function* saga() {
    yield takeLatest(FETCH_STILLING_BEGIN, getStilling);
};
