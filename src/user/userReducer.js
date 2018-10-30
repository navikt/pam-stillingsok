import { select, put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import { get, SearchApiError, post, put as apiPut, remove } from '../api/api';
import { AD_USER_API } from '../fasitProperties';
import delay from '../common/delay';

export const FETCH_IS_AUTHENTICATED = 'FETCH_IS_AUTHENTICATED';
export const FETCH_IS_AUTHENTICATED_SUCCESS = 'FETCH_IS_AUTHENTICATED_SUCCESS';

export const SHOW_AUTHORIZATION_ERROR_MODAL = 'SHOW_AUTHORIZATION_ERROR_MODAL';
export const HIDE_AUTHORIZATION_ERROR_MODAL = 'HIDE_AUTHORIZATION_ERROR_MODAL';

export const SHOW_TERMS_OF_USE_MODAL = 'SHOW_TERMS_OF_USE_MODAL';
export const HIDE_TERMS_OF_USE_MODAL = 'HIDE_TERMS_OF_USE_MODAL';

export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_BEGIN = 'CREATE_USER_BEGIN';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const UPDATE_USER = 'UPDATE_USER';
export const UPDATE_USER_BEGIN = 'UPDATE_USER_BEGIN';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_HIDE_ALERT = 'UPDATE_USER_HIDE_ALERT';
export const UPDATE_USER_FAILURE = 'UPDATE_USER_FAILURE';

export const SHOW_CONFIRM_DELETE_USER_MODAL = 'SHOW_CONFIRM_DELETE_USER_MODAL';
export const HIDE_CONFIRM_DELETE_USER_MODAL = 'HIDE_CONFIRM_DELETE_USER_MODAL';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_BEGIN = 'DELETE_USER_BEGIN';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const SET_USER_EMAIL = 'SET_USER_EMAIL';

const TERMS_VERSION = 'sok_v1';

const initialState = {
    isAuthenticated: undefined,
    authorizationError: undefined,
    user: undefined,
    isCreating: false,
    isUpdating: false,
    isDeletingUser: false,
    createUserError: undefined,
    updateUserError: undefined,
    userAlertStripeIsVisible: false,
    termsOfUseModalIsVisible: false,
    confirmDeleteUserModalIsVisible: false
};

const setEmail = function setEmail(user, newEmail) {
    if (newEmail && newEmail.trim().length > 0) {
        return {
            ...user,
            email: newEmail
        };
    }
    // eslint-disable-next-line no-unused-vars
    const { email, ...withoutEmail } = user;
    return withoutEmail;
};

export default function authorizationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_IS_AUTHENTICATED_SUCCESS:
            return {
                ...state,
                isAuthenticated: action.isAuthenticated
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.response
            };
        case CREATE_USER_BEGIN:
            return {
                ...state,
                isCreating: true,
                createUserError: undefined
            };
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                user: action.response,
                isCreating: false,
                termsOfUseModalIsVisible: false
            };
        case CREATE_USER_FAILURE:
            return {
                ...state,
                isCreating: false,
                createUserError: action.error
            };
        case SET_USER_EMAIL:
            return {
                ...state,
                user: setEmail(state.user, action.email)
            };
        case UPDATE_USER_BEGIN:
            return {
                ...state,
                isUpdating: true,
                updateUserError: undefined
            };
        case UPDATE_USER_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                user: action.response,
                userAlertStripeIsVisible: true
            };
        case UPDATE_USER_HIDE_ALERT:
            return {
                ...state,
                userAlertStripeIsVisible: false
            };
        case UPDATE_USER_FAILURE:
            return {
                ...state,
                isUpdating: false,
                userAlertStripeIsVisible: false,
                updateUserError: action.error
            };
        case SHOW_TERMS_OF_USE_MODAL:
            return {
                ...state,
                termsOfUseModalIsVisible: true
            };
        case HIDE_TERMS_OF_USE_MODAL:
            return {
                ...state,
                termsOfUseModalIsVisible: false,
                createUserError: undefined
            };
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
        case SHOW_CONFIRM_DELETE_USER_MODAL:
            return {
                ...state,
                confirmDeleteUserModalIsVisible: true
            };
        case HIDE_CONFIRM_DELETE_USER_MODAL:
            return {
                ...state,
                confirmDeleteUserModalIsVisible: false,
                deleteUserError: undefined
            };
        case DELETE_USER_BEGIN:
            return {
                ...state,
                isDeletingUser: true,
                deleteUserError: undefined
            };
        case DELETE_USER_FAILURE:
            return {
                ...state,
                isDeletingUser: false,
                deleteUserError: action.error
            };
        default:
            return state;
    }
}

function* fetchIsAuthenticated() {
    const response = yield fetch(`${AD_USER_API}/isAuthenticated`, { credentials: 'include' });
    if (response.status === 200) {
        yield put({ type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: true });
    } else if (response.status === 401) {
        yield put({ type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: false });
    } else {
        yield put({ type: FETCH_IS_AUTHENTICATED_SUCCESS, isAuthenticated: undefined });
    }
}

function* fetchUser() {
    const state = yield select();
    if (state.user.isAuthenticated) {
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

function* createUser(action) {
    yield put({ type: CREATE_USER_BEGIN });
    try {
        let userData = {
            acceptedTerms: TERMS_VERSION
        };
        if (action.email && action.email.trim().length > 0) {
            userData = {
                ...userData,
                email: action.email
            };
        }
        const response = yield call(post, `${AD_USER_API}/api/v1/user`, userData);
        yield put({ type: CREATE_USER_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: CREATE_USER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* updateUser() {
    try {
        const state = yield select();
        yield put({ type: UPDATE_USER_BEGIN });
        const response = yield call(apiPut, `${AD_USER_API}/api/v1/user`, state.user.user);
        yield put({ type: UPDATE_USER_SUCCESS, response });
        yield call(delay, 5000);
        yield put({ type: UPDATE_USER_HIDE_ALERT });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: UPDATE_USER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* deleteUser() {
    try {
        yield put({ type: DELETE_USER_BEGIN });
        yield call(remove, `${AD_USER_API}/api/v1/user`);
        window.location.reload();
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: DELETE_USER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

export const userSaga = function* saga() {
    yield takeEvery(FETCH_IS_AUTHENTICATED, fetchIsAuthenticated);
    yield takeEvery(FETCH_IS_AUTHENTICATED_SUCCESS, fetchUser);
    yield takeLatest(CREATE_USER, createUser);
    yield takeLatest(UPDATE_USER, updateUser);
    yield takeLatest(DELETE_USER, deleteUser);
};
