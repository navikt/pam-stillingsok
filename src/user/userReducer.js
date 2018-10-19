import { select, put, call, takeLatest } from 'redux-saga/effects';
import { get, SearchApiError, post } from '../api/api';
import { AD_USER_API } from '../fasitProperties';
import featureToggle from '../featureToggle';
import { ACCEPT_TERMS, CURRENT_TERMS_OF_USE } from '../termsOfUse/termsOfUseReducer';
import { FETCH_AUTHENTICATION_SUCCESS } from '../authentication/authenticationReducer';

export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const CREATE_USER_BEGIN = 'CREATE_USER_BEGIN';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

const initialState = {
    user: undefined,
    hasUser: false
};

export default function userReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_BEGIN:
            return {
                ...state
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.response,
                hasUser: true
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                hasUser: false
            };
        case CREATE_USER_BEGIN:
            return {
                ...state
            };
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                user: action.response,
                hasUser: true
            };
        case CREATE_USER_FAILURE:
            return {
                ...state,
                error: 'create_error'
            };
        default:
            return state;
    }
}

function* fetchUser() {
    if (featureToggle()) {
        const state = yield select();
        if (state.authentication.isAuthenticated) {
            yield put({ type: FETCH_USER_BEGIN });
            try {
                const response = yield call(get, `${AD_USER_API}/api/v1/user`);
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
}

function* createUser() {
    yield put({ type: CREATE_USER_BEGIN });
    try {
        const response = yield call(post, `${AD_USER_API}/api/v1/user`, { acceptedTerms: CURRENT_TERMS_OF_USE });
        yield put({ type: CREATE_USER_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: CREATE_USER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const userSaga = function* saga() {
    yield takeLatest(FETCH_AUTHENTICATION_SUCCESS, fetchUser);
    yield takeLatest(ACCEPT_TERMS, createUser);
};
