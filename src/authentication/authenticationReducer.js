import { put, takeEvery, select } from 'redux-saga/effects';
import { AD_USER_API } from '../fasitProperties';
import AuthenticationCaller from './AuthenticationCaller';

export const FETCH_IS_AUTHENTICATED = 'FETCH_IS_AUTHENTICATED';
export const FETCH_IS_AUTHENTICATED_SUCCESS = 'FETCH_IS_AUTHENTICATED_SUCCESS';
export const FETCH_IS_AUTHENTICATED_FAILURE = 'FETCH_IS_AUTHENTICATED_FAILURE';

export const SHOW_AUTHENTICATION_REQUIRED_MODAL = 'SHOW_AUTHENTICATION_REQUIRED_MODAL';
export const HIDE_AUTHENTICATION_REQUIRED_MODAL = 'HIDE_AUTHENTICATION_REQUIRED_MODAL';

const initialState = {
    isAuthenticated: undefined,
    authenticationRequiredModalIsVisible: false
};

export default function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_IS_AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.isAuthenticated
            };
        case FETCH_IS_AUTHENTICATED_FAILURE:
            return {
                ...state,
                isAuthenticated: undefined
            };
        case SHOW_AUTHENTICATION_REQUIRED_MODAL:
            return {
                ...state,
                authenticationRequiredModalIsVisible: true,
                authenticationRequiredTitle: action.title
            };
        case HIDE_AUTHENTICATION_REQUIRED_MODAL:
            return {
                ...state,
                authenticationRequiredModalIsVisible: false
            };
        default:
            return state;
    }
}

function* fetchIsAuthenticated() {
    try {
        const response = yield fetch(`${AD_USER_API}/isAuthenticated`, { credentials: 'include' });
        if (response.status === 200) {
            yield put({ type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: true });
        } else if (response.status === 401) {
            yield put({ type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: false });
        } else {
            yield put({ type: FETCH_IS_AUTHENTICATED_FAILURE });
        }
    } catch (error) {
        yield put({ type: FETCH_IS_AUTHENTICATED_FAILURE });
        throw error;
    }
}

export const requiresAuthentication = function* requiresAuthentication(caller) {
    const state = yield select();
    if (state.authentication.isAuthenticated === true) {
        return true;
    }
    yield put({ type: SHOW_AUTHENTICATION_REQUIRED_MODAL, title: caller || AuthenticationCaller.DEFAULT });
    return false;
};

export const authenticationSaga = function* saga() {
    yield takeEvery(FETCH_IS_AUTHENTICATED, fetchIsAuthenticated);
};
