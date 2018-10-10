import { call, put, select, throttle } from 'redux-saga/effects';
import { fetchCategoryAndSearchTagsSuggestions, SearchApiError } from '../../api/api';
import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../urlReducer';
import { RESET_SEARCH } from '../searchReducer';

export const SET_VALUE = 'SET_VALUE';
export const FETCH_SUGGESTIONS = 'FETCH_SUGGESTIONS';
export const FETCH_SUGGESTIONS_SUCCESS = 'FETCH_SUGGESTIONS_SUCCESS';
export const FETCH_SUGGESTIONS_FAILURE = 'FETCH_SUGGESTIONS_FAILURE';

const initialState = {
    suggestions: [],
    q: ''
};

export default function searchBoxReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            return {
                ...state,
                q: action.query.q || ''
            };
        case RESET_SEARCH:
            return {
                ...state,
                q: ''
            };
        case SET_VALUE:
            return {
                ...state,
                q: action.value
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
            const newState = yield select();
            if (newState.searchBox.q.length >= MIN_LENGTH) {
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
