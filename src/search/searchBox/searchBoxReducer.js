import { select, call, put, throttle } from 'redux-saga/effects';
import { fetchCategoryAndSearchTagsSuggestions, SearchApiError } from '../../api/api';
import { SET_INITIAL_STATE } from '../searchReducer';

export const SET_VALUE = 'SET_VALUE';
export const SELECT_SUGGESTION = 'SELECT_SUGGESTION';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS';
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE';

const initialState = {
    suggestions: [],
    q: ''
};

export default function searchBoxReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                q: action.query.q || ''
            };
        case SET_VALUE:
            return {
                ...state,
                q: action.value
            };
        case SELECT_SUGGESTION:
            return {
                ...state,
                suggestions: []
            };
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
    const value = state.searchBox.q;
    const MIN_LENGTH = 3;
    if (value.length >= MIN_LENGTH) {
        try {
            const response = yield call(fetchCategoryAndSearchTagsSuggestions, value, MIN_LENGTH);
            yield put({ type: FETCH_SUGGESTIONS_SUCCESS, suggestions: response.result });
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
    yield throttle(1000, FETCH_SUGGESTIONS, fetchSuggestions);
};
