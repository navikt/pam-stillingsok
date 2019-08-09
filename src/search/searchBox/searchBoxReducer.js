import { call, put, select, throttle } from 'redux-saga/effects';
import { fetchCategoryAndSearchTagsSuggestions } from '../../api/api';
import SearchApiError from '../../api/SearchApiError';

export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS';
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE';

const initialState = {
    suggestions: []
};

export default function searchBoxReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SUGGESTIONS_SUCCESS:
            return {
                ...state,
                suggestions: action.suggestions
            };
        default:
            return state;
    }
}

function* fetchSuggestions() {
    const state = yield select();
    const value = state.searchQuery.q;
    const MIN_LENGTH = 3;
    if (value.length >= MIN_LENGTH) {
        try {
            const response = yield call(fetchCategoryAndSearchTagsSuggestions, value, MIN_LENGTH);
            const newState = yield select();
            if (newState.searchQuery.q.length >= MIN_LENGTH) {
                yield put({ type: FETCH_SUGGESTIONS_SUCCESS, suggestions: response.result });
            } else {
                yield put({ type: FETCH_SUGGESTIONS_SUCCESS, suggestions: [] });
            }
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_SUGGESTIONS_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    } else {
        yield put({ type: FETCH_SUGGESTIONS_SUCCESS, suggestions: [] });
    }
}

export const searchBoxSaga = function* searchBoxSaga() {
    yield throttle(500, FETCH_SUGGESTIONS, fetchSuggestions);
};
