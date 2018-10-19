import { put, takeLatest } from 'redux-saga/effects';
import { AD_USER_API } from '../fasitProperties';

export const FETCH_AUTHENTICATION_STATUS = 'FETCH_AUTHENTICATION_STATUS';
export const FETCH_AUTHENTICATION_BEGIN = 'FETCH_AUTHENTICATION_BEGIN';
export const FETCH_AUTHENTICATION_SUCCESS = 'FETCH_AUTHENTICATION_SUCCESS';
export const FETCH_AUTHENTICATION_FAILURE = 'FETCH_AUTHENTICATION_FAILURE';

const initialState = {
    isAuthenticated: false
};

export default function authenticationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_AUTHENTICATION_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.isAuthenticated
            };
        case FETCH_AUTHENTICATION_FAILURE:
            return {
                ...state,
                isAuthenticated: undefined
            };
        default:
            return state;
    }
}

function* fetchAuthenticationStatus() {
    yield put({ type: FETCH_AUTHENTICATION_BEGIN });
    try {
        const response = yield fetch(`${AD_USER_API}/api/v1/user`, { credentials: 'include' });
        if (response.status === 200 || response.status === 404) {
            yield put({ type: FETCH_AUTHENTICATION_SUCCESS, isAuthenticated: true });
        } else if (response.status === 401) {
            yield put({ type: FETCH_AUTHENTICATION_SUCCESS, isAuthenticated: false });
        } else {
            yield put({ type: FETCH_AUTHENTICATION_FAILURE });
        }
    } catch (e) {
        yield put({ type: FETCH_AUTHENTICATION_FAILURE });
    }
}


export const authenticationSaga = function* saga() {
    yield takeLatest(FETCH_AUTHENTICATION_STATUS, fetchAuthenticationStatus);
};
