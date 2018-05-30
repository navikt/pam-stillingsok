import { select, call, put, takeLatest } from 'redux-saga/effects';
import { fetchTypeaheadSuggestions, SearchApiError } from '../../api/api';

export const SELECT_TYPE_AHEAD_VALUE = 'SELECT_TYPE_AHEAD_TOKEN';
export const FETCH_TYPE_AHEAD_SUGGESTIONS = 'FETCH_TYPE_AHEAD_SUGGESTIONS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS = 'FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_FAILURE';
export const FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE = 'FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE';

const initialState = {
    typeAheadSuggestions: [],
    cachedTypeAheadSuggestions: []
};

export default function searchBoxReducer(state = initialState, action) {
    switch (action.type) {
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
        default:
            return state;
    }
}

function* fetchTypeAheadSuggestions() {
    const TYPE_AHEAD_MIN_INPUT_LENGTH = 3;
    const state = yield select();
    const value = state.search.query.q;
    if (value && value.length >= TYPE_AHEAD_MIN_INPUT_LENGTH) {
        if (state.search.cachedTypeAheadSuggestions.length === 0) {
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
            const suggestions = state.search.cachedTypeAheadSuggestions.filter((cachedSuggestion) => (
                cachedSuggestion.toLowerCase().startsWith(value.toLowerCase())));
            yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions });
        }
    } else {
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_CACHE, cachedSuggestions: [] });
        yield put({ type: FETCH_TYPE_AHEAD_SUGGESTIONS_SUCCESS, suggestions: [] });
    }
}

export const searchBoxSaga = function* saga() {
    yield takeLatest(FETCH_TYPE_AHEAD_SUGGESTIONS, fetchTypeAheadSuggestions);
};
