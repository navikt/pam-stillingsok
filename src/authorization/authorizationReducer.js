import { select, put, call, takeEvery } from 'redux-saga/effects';
import { get, SearchApiError } from '../api/api';
import { AD_USER_API } from '../fasitProperties';
import { USER_UUID_HACK } from '../favourites/favouritesReducer';

export const SHOW_AUTHORIZATION_ERROR_MODAL = 'SHOW_AUTHORIZATION_ERROR_MODAL';
export const HIDE_AUTHORIZATION_ERROR_MODAL = 'HIDE_AUTHORIZATION_ERROR_MODAL';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const AuthorizationEnum = {
    SAVE_SEARCH_ERROR: 'For å lagre et søk må du logge inn',
    ADD_FAVORITE_ERROR: 'For å lagre en favoritt må du logge inn'
};

const initialState = {
    authorizationError: undefined,
    isFetchingUser: false,
    shouldFetchUser: true,
    isLoggedIn: false
};

export default function authorizationReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_AUTHORIZATION_ERROR_MODAL:
            return {
                ...state,
                authorizationError: action.text
            };
        case HIDE_AUTHORIZATION_ERROR_MODAL:
            return {
                ...state,
                authorizationError: undefined
            };
        case FETCH_USER_BEGIN:
            return {
                ...state,
                isFetchingUser: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                isFetchingUser: false,
                shouldFetchUser: false,
                isLoggedIn: true
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                isFetchingUser: false,
                isLoggedIn: false
            };
        default:
            return state;
    }
}

function* fetchUser() {
    const state = yield select();

    if (state.authorization.shouldFetchUser) {
        yield put({ type: FETCH_USER_BEGIN });
        try {
            const response = yield call(get, `${AD_USER_API}/api/v1/user/${USER_UUID_HACK}`);
            yield put({ type: FETCH_USER_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_USER_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

export const authorizationSaga = function* saga() {
    yield takeEvery(FETCH_USER, fetchUser);
};
