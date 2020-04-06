import { call, put, takeLatest } from 'redux-saga/effects';
import { fetchInternStilling } from '../api/api';
import SearchApiError from '../api/SearchApiError';

export const RESET_INTERAL_STILLING = 'RESET_INTERAL_STILLING';
export const FETCH_INTERAL_STILLING_BEGIN = 'FETCH_INTERAL_STILLING_BEGIN';
export const FETCH_INTERAL_STILLING_SUCCESS = 'FETCH_INTERAL_STILLING_SUCCESS';
export const FETCH_INTERAL_STILLING_FAILURE = 'FETCH_INTERAL_STILLING_FAILURE';
export const FETCH_INTERAL_STILLING_NOT_FOUND = 'FETCH_INTERAL_STILLING_NOT_FOUND';

const initialState = {
    stilling: undefined,
    error: undefined
};

export default function internalStillingReducer(state = initialState, action) {
    switch (action.type) {
        case RESET_INTERAL_STILLING:
            return initialState;
        case FETCH_INTERAL_STILLING_BEGIN:
            return {
                ...state,
                stilling: undefined,
                isFetchingStilling: true,
                error: undefined
            };
        case FETCH_INTERAL_STILLING_SUCCESS:
            return {
                ...state,
                stilling: action.response,
                isFetchingStilling: false
            };
        case FETCH_INTERAL_STILLING_FAILURE:
            return {
                ...state,
                error: action.error,
                isFetchingStilling: false
            };
        case FETCH_INTERAL_STILLING_NOT_FOUND:
            return {
                ...state,
                error: action.error,
                isFetchingStilling: false
            };
        default:
            return state;
    }
}

function* getInternalStilling(action) {
    try {
        const response = yield call(fetchInternStilling, action.uuid);
        yield put({ type: FETCH_INTERAL_STILLING_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            if (e.statusCode === 404) {
                yield put({ type: FETCH_INTERAL_STILLING_NOT_FOUND, error: e });
            } else {
                yield put({ type: FETCH_INTERAL_STILLING_FAILURE, error: e });
            }
        } else {
            throw e;
        }
    }
}

export const internalStillingSaga = function* saga() {
    yield takeLatest(FETCH_INTERAL_STILLING_BEGIN, getInternalStilling);
};
