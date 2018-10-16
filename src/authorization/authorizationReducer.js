import { select, put, call, takeEvery, takeLatest } from 'redux-saga/effects';
import { get, SearchApiError, post} from '../api/api';
import { AD_USER_API } from '../fasitProperties';
import featureToggle from '../featureToggle';
import history from '../history';

export const SHOW_AUTHORIZATION_ERROR_MODAL = 'SHOW_AUTHORIZATION_ERROR_MODAL';
export const HIDE_AUTHORIZATION_ERROR_MODAL = 'HIDE_AUTHORIZATION_ERROR_MODAL';

export const FETCH_USER = 'FETCH_USER';
export const FETCH_USER_BEGIN = 'FETCH_USER_BEGIN';
export const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
export const FETCH_USER_FAILURE = 'FETCH_USER_FAILURE';

export const DECLINE_TERMS_OF_USE = 'DECLINE_TERMS_OF_USE';

export const CREATE_USER = 'CREATE_USER';
export const CREATE_USER_BEGIN = 'CREATE_USER_BEGIN';
export const CREATE_USER_SUCCESS = 'CREATE_USER_SUCCESS';
export const CREATE_USER_FAILURE = 'CREATE_USER_FAILURE';

const initialState = {
    authorizationError: undefined,
    isFetchingUser: false,
    shouldFetchUser: true,
    isLoggedIn: false,
    termsVersion: undefined,
    termsStatus: undefined
};

export default function authorizationReducer(state = initialState, action) {
    switch (action.type) {
        case DECLINE_TERMS_OF_USE:
            return {
                ...state,
                termsStatus: 'declined'
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
        case CREATE_USER_BEGIN:
            return {
                ...state,
                shouldFetchUser: false
            };
        case FETCH_USER_BEGIN:
            return {
                ...state,
                isFetchingUser: true
            };
        case CREATE_USER_SUCCESS:
            return {
                ...state,
                termsVersion: action.response.acceptedTerms,
                termsStatus: 'accepted',
                isLoggedIn: true
            };
        case FETCH_USER_SUCCESS:
            return {
                ...state,
                isFetchingUser: false,
                shouldFetchUser: false,
                isLoggedIn: true
            };
        case CREATE_USER_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                isFetchingUser: false,
                shouldFetchUser: true,
                isLoggedIn: false
            };
        case FETCH_USER_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                isFetchingUser: false,
                shouldFetchUser: true,
                // 404: Bruker er innlogget men ikke opprettet i databasen
                isLoggedIn: (action.error.statusCode === 404)
            };
        default:
            return state;
    }
}

function* fetchUser() {
    const state = yield select();

    if (featureToggle() && state.authorization.shouldFetchUser) {
        yield put({ type: FETCH_USER_BEGIN });
        try {
            const response = yield call(get, `${AD_USER_API}/api/v1/user`);
            yield put({ type: FETCH_USER_SUCCESS, response });
            // TODO: sjekk om bruker har akseptert riktig versjon av vilkår
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
        const response = yield call(post, `${AD_USER_API}/api/v1/user`, { acceptedTerms: action.terms });
        yield put({ type: CREATE_USER_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({type: CREATE_USER_FAILURE, error: e});
        } else {
            throw e;
        }
    }
}

export const authorizationSaga = function* saga() {
    yield takeEvery(FETCH_USER, fetchUser);
    yield takeLatest(CREATE_USER, createUser);
};
