import {
    select,
    put,
    call,
    takeEvery,
    takeLatest
} from 'redux-saga/effects';
import SearchApiError from '../api/SearchApiError';
import {
    userApiGet,
    userApiPost,
    userApiRemove,
    userApiPut
} from '../api/userApi';
import { authenticationEnum, FETCH_IS_AUTHENTICATED_SUCCESS } from '../authentication/authenticationReducer';
import { AD_USER_API } from '../fasitProperties';
import delay from '../common/delay';

export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';
export const FETCH_USER_FAILURE_NO_USER = 'FETCH_USER_FAILURE_NO_USER';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_BEGIN = 'CREATE_USER_BEGIN';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_HIDE_ALERT = 'CREATE_USER_HIDE_ALERT';
export const CREATE_USER_SHOW_ALERT = 'CREATE_USER_SHOW_ALERT';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

export const UPDATE_USER_EMAIL = 'UPDATE_USER_EMAIL';
export const UPDATE_USER_EMAIL_BEGIN = 'UPDATE_USER_EMAIL_BEGIN';
export const UPDATE_USER_EMAIL_SUCCESS = 'UPDATE_USER_EMAIL_SUCCESS';
export const UPDATE_USER_EMAIL_SHOW_ALERT = 'UPDATE_USER_EMAIL_SHOW_ALERT';
export const UPDATE_USER_EMAIL_HIDE_ALERT = 'UPDATE_USER_EMAIL_HIDE_ALERT';
export const UPDATE_USER_EMAIL_FAILURE = 'UPDATE_USER_EMAIL_FAILURE';

export const SHOW_CONFIRM_DELETE_USER_MODAL = 'SHOW_CONFIRM_DELETE_USER_MODAL';
export const HIDE_CONFIRM_DELETE_USER_MODAL = 'HIDE_CONFIRM_DELETE_USER_MODAL';

export const DELETE_USER = 'DELETE_USER';
export const DELETE_USER_BEGIN = 'DELETE_USER_BEGIN';
export const DELETE_USER_FAILURE = 'DELETE_USER_FAILURE';

export const FETCH_TERMS_OF_USE = 'FETCH_TERMS_OF_USE';
export const SET_TERMS_OF_USE = 'SET_TERMS_OF_USE';

export const SET_USER_EMAIL = 'SET_USER_EMAIL';
export const VALIDATE_USER_EMAIL = 'VALIDATE_USER_EMAIL';

export const SET_VALIDATION_ERROR = 'SET_VALIDATION_ERROR';
export const REMOVE_VALIDATION_ERROR = 'REMOVE_VALIDATION_ERROR';

export const SET_EMAIL_FROM_SAVED_SEARCH = 'SET_EMAIL_FROM_SAVED_SEARCH';

const initialState = {
    user: undefined,
    isFetchingUser: false,
    isCreating: false,
    isUpdating: false,
    isDeletingUser: false,
    userAlertStripeIsVisible: false,
    userAlertStripeMode: 'added',
    confirmDeleteUserModalIsVisible: false,
    validation: {},
    termsOfUse: undefined
};

export default function authorizationReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_USER_BEGIN:
            return {
                ...state,
                user: action.response,
                isFetchingUser: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                user: action.response,
                isFetchingUser: false
            };
        case FETCH_USER_FAILURE:
        case FETCH_USER_FAILURE_NO_USER:
            return {
                ...state,
                isFetchingUser: false
            };
        case CREATE_USER_BEGIN:
            return {
                ...state,
                isCreating: true
            };
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                user: action.response,
                isCreating: false,
                userAlertStripeIsVisible: false
            };
        case CREATE_USER_SHOW_ALERT:
            return {
                ...state,
                userAlertStripeIsVisible: true,
                userAlertStripeMode: 'added'
            };
        case CREATE_USER_FAILURE:
            return {
                ...state,
                isCreating: false,
                userAlertStripeIsVisible: false
            };
        case SET_USER_EMAIL:
            return {
                ...state,
                user: {
                    ...state.user,
                    email: action.email
                }
            };
        case UPDATE_USER_EMAIL_BEGIN:
            return {
                ...state,
                isUpdating: true
            };
        case UPDATE_USER_EMAIL_SUCCESS:
            return {
                ...state,
                isUpdating: false,
                user: action.response
            };
        case UPDATE_USER_EMAIL_SHOW_ALERT:
            return {
                ...state,
                userAlertStripeIsVisible: true,
                userAlertStripeMode: action.mode
            };
        case CREATE_USER_HIDE_ALERT:
        case UPDATE_USER_EMAIL_HIDE_ALERT:
            return {
                ...state,
                userAlertStripeIsVisible: false
            };
        case UPDATE_USER_EMAIL_FAILURE:
            return {
                ...state,
                isUpdating: false,
                userAlertStripeIsVisible: false
            };
        case SHOW_CONFIRM_DELETE_USER_MODAL:
            return {
                ...state,
                confirmDeleteUserModalIsVisible: true
            };
        case HIDE_CONFIRM_DELETE_USER_MODAL:
            return {
                ...state,
                confirmDeleteUserModalIsVisible: false
            };
        case DELETE_USER_BEGIN:
            return {
                ...state,
                isDeletingUser: true
            };
        case DELETE_USER_FAILURE:
            return {
                ...state,
                confirmDeleteUserModalIsVisible: false,
                isDeletingUser: false
            };
        case SET_VALIDATION_ERROR:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    [action.field]: action.message
                }
            };
        case REMOVE_VALIDATION_ERROR:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    [action.field]: undefined
                }
            };
        case SET_TERMS_OF_USE:
            return {
                ...state,
                termsOfUse: action.terms
            };
        default:
            return state;
    }
}

const fixUser = function fixUser(user) {
    if (user.email !== undefined && user.email !== null && user.email.trim().length === 0) {
        return {
            ...user,
            email: null
        };
    }
    return user;
};

function* fetchUser() {
    const state = yield select();
    if (state.authentication.isAuthenticated === authenticationEnum.IS_AUTHENTICATED) {
        yield put({ type: FETCH_USER_BEGIN });
        try {
            const response = yield call(userApiGet, `${AD_USER_API}/api/v1/user`);
            yield put({ type: FETCH_USER_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                if (e.statusCode !== 404) {
                    yield put({ type: FETCH_USER_FAILURE, error: e });
                } else {
                    yield put({ type: FETCH_USER_FAILURE_NO_USER });
                }
            } else {
                throw e;
            }
        }
    }
}

function* createUser(action) {
    yield put({ type: CREATE_USER_BEGIN });
    try {
        const user = { email: action.email };
        const response = yield call(userApiPost, `${AD_USER_API}/api/v1/user`, fixUser(user));
        yield put({ type: CREATE_USER_SUCCESS, response });
        if (user.email) {
            yield put({ type: CREATE_USER_SHOW_ALERT });
            yield call(delay, 5000);
            yield put({ type: CREATE_USER_HIDE_ALERT });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: CREATE_USER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* updateUserEmail() {
    const state = yield select();
    if (state.user.validation.email === undefined) {
        const isClearingEmail = state.user.user.email === null || state.user.user.email.trim().length === 0;
        try {
            yield put({ type: UPDATE_USER_EMAIL_BEGIN });
            const response = yield call(userApiPut, `${AD_USER_API}/api/v1/user`, fixUser(state.user.user));
            yield put({ type: UPDATE_USER_EMAIL_SUCCESS, response });
            yield put({
                type: UPDATE_USER_EMAIL_SHOW_ALERT,
                mode: isClearingEmail ? 'clear-email' : 'set-email'
            });
            yield call(delay, 5000);
            yield put({ type: UPDATE_USER_EMAIL_HIDE_ALERT });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: UPDATE_USER_EMAIL_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* setEmailFromSavedSearch() {
    let state = yield select();
    if (state.savedSearchForm.validation.email === undefined) {
        try {
            yield put({ type: UPDATE_USER_EMAIL_BEGIN });
            yield put({ type: SET_USER_EMAIL, email: state.savedSearchForm.emailInputValue });
            state = yield select();
            const response = yield call(userApiPut, `${AD_USER_API}/api/v1/user`, state.user.user);
            yield put({ type: UPDATE_USER_EMAIL_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: UPDATE_USER_EMAIL_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* deleteUser() {
    try {
        yield put({ type: DELETE_USER_BEGIN });
        yield call(userApiRemove, `${AD_USER_API}/api/v1/user`);
        window.location.reload();
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: DELETE_USER_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* validateEMail() {
    const email = yield select((state) => state.user.user.email);
    const error = email && (email.length > 0) && (email.indexOf('@') === -1);
    if (error) {
        yield put({
            type: SET_VALIDATION_ERROR,
            field: 'email',
            message: 'E-postadressen er ugyldig. Den må minimum inneholde en «@»'
        });
    } else {
        yield put({ type: REMOVE_VALIDATION_ERROR, field: 'email' });
    }
}

function* fetchTermsOfUse() {
    const terms = yield call(userApiGet, `${AD_USER_API}/api/v1/user/consent/terms`);
    yield put({ type: SET_TERMS_OF_USE, terms });
}

export const userSaga = function* saga() {
    yield takeEvery(FETCH_IS_AUTHENTICATED_SUCCESS, fetchUser);
    yield takeLatest(CREATE_USER, createUser);
    yield takeLatest(UPDATE_USER_EMAIL, updateUserEmail);
    yield takeLatest(SET_EMAIL_FROM_SAVED_SEARCH, setEmailFromSavedSearch);
    yield takeLatest(DELETE_USER, deleteUser);
    yield takeLatest(VALIDATE_USER_EMAIL, validateEMail);
    yield takeLatest(FETCH_TERMS_OF_USE, fetchTermsOfUse);
};
