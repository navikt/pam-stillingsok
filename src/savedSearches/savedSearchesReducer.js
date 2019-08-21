import { call, put, select, take, takeEvery, takeLatest } from 'redux-saga/effects';
import SearchApiError from '../api/SearchApiError';
import { userApiGet, userApiPost, userApiPut, userApiRemove } from '../api/userApi';
import { authenticationEnum, FETCH_IS_AUTHENTICATED_SUCCESS } from '../authentication/authenticationReducer';
import { AD_USER_API } from '../fasitProperties';
import {
    isSearchQueryEmpty,
    RESTORE_STATE_FROM_URL,
    SET_SEARCH_STRING,
    toSavedSearchQuery
} from '../search/searchQueryReducer';
import { INITIAL_SEARCH, RESET_SEARCH, SEARCH, SEARCH_SUCCESS } from '../search/searchReducer';
import { FETCH_USER_FAILURE_NO_USER, FETCH_USER_SUCCESS } from '../user/userReducer';
import { parseQueryString } from '../utils';
import { SavedSearchFormMode, SHOW_SAVED_SEARCH_FORM, validateAll } from './form/savedSearchFormReducer';

export const FETCH_SAVED_SEARCHES = 'FETCH_SAVED_SEARCHES';
export const FETCH_SAVED_SEARCHES_BEGIN = 'FETCH_SAVED_SEARCHES_BEGIN';
export const FETCH_SAVED_SEARCHES_SUCCESS = 'FETCH_SAVED_SEARCHES_SUCCESS';
export const FETCH_SAVED_SEARCHES_FAILURE = 'FETCH_SAVED_SEARCHES_FAILURE';

export const SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL = 'ABOUT_TO_REMOVE_SAVED_SEARCH';
export const HIDE_MODAL_REMOVE_SAVED_SEARCH = 'CONFIRM_REMOVE_SAVED_SEARCH';
export const REMOVE_SAVED_SEARCH = 'REMOVE_SAVED_SEARCH';
export const REMOVE_SAVED_SEARCH_BEGIN = 'REMOVE_SAVED_SEARCH_BEGIN';
export const REMOVE_SAVED_SEARCH_SUCCESS = 'REMOVE_SAVED_SEARCH_SUCCESS';
export const REMOVE_SAVED_SEARCH_FAILURE = 'REMOVE_SAVED_SEARCH_FAILURE';

export const ADD_SAVED_SEARCH = 'ADD_SAVED_SEARCH';
export const ADD_SAVED_SEARCH_BEGIN = 'ADD_SAVED_SEARCH_BEGIN';
export const ADD_SAVED_SEARCH_SUCCESS = 'ADD_SAVED_SEARCH_SUCCESS';
export const ADD_SAVED_SEARCH_FAILURE = 'ADD_SAVED_SEARCH_FAILURE';

export const UPDATE_SAVED_SEARCH = 'UPDATE_SAVED_SEARCH';
export const UPDATE_SAVED_SEARCH_BEGIN = 'UPDATE_SAVED_SEARCH_BEGIN';
export const UPDATE_SAVED_SEARCH_SUCCESS = 'UPDATE_SAVED_SEARCH_SUCCESS';
export const UPDATE_SAVED_SEARCH_FAILURE = 'UPDATE_SAVED_SEARCH_FAILURE';

export const SET_CURRENT_SAVED_SEARCH = 'SET_CURRENT_SAVED_SEARCH';
export const RESTORE_STATE_FROM_SAVED_SEARCH = 'RESTORE_STATE_FROM_SAVED_SEARCH';
export const RESTORE_CURRENT_SAVED_SEARCH = 'RESTORE_CURRENT_SAVED_SEARCH';
export const RESTORE_CURRENT_SAVED_SEARCH_DONE = 'RESTORE_CURRENT_SAVED_SEARCH_DONE';
export const SET_CAN_SAVE_SEARCH = 'SET_CAN_SAVE_SEARCH';
export const RESTORE_SAVED_SEARCH_WORKFLOW_AFTER_LOGIN = 'RESTORE_SAVED_SEARCH_WORKFLOW_AFTER_LOGIN';

const initialState = {
    savedSearches: [],
    isFetching: false,
    shouldFetch: true,
    savedSearchAboutToBeRemoved: undefined,
    confirmationVisible: false,
    totalElements: 0,
    isSaving: false,
    pending: [],
    currentSavedSearch: undefined,
    canSaveSearch: false
};

export default function savedSearchesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SAVED_SEARCHES_BEGIN:
            return {
                ...state,
                isFetching: true,
                shouldFetch: false
            };
        case FETCH_SAVED_SEARCHES_SUCCESS:
            return {
                ...state,
                savedSearches: action.response.content,
                totalElements: action.response.totalElements,
                isFetching: false
            };
        case FETCH_SAVED_SEARCHES_FAILURE:
            return {
                ...state,
                isFetching: false
            };
        case REMOVE_SAVED_SEARCH_BEGIN:
            return {
                ...state,
                pending: [...state.pending, action.uuid]
            };
        case REMOVE_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                savedSearches: state.savedSearches.filter((savedSearch) => savedSearch.uuid !== action.uuid),
                totalElements: state.totalElements - 1,
                pending: state.pending.filter((uuid) => uuid !== action.uuid)
            };
        case REMOVE_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                pending: state.pending.filter((uuid) => uuid !== action.uuid)
            };
        case SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL:
            return {
                ...state,
                confirmationVisible: true,
                savedSearchAboutToBeRemoved: state.savedSearches.find((savedSearch) => savedSearch.uuid === action.uuid)
            };
        case HIDE_MODAL_REMOVE_SAVED_SEARCH:
            return {
                ...state,
                confirmationVisible: false
            };
        case UPDATE_SAVED_SEARCH_BEGIN: {
            return {
                ...state,
                isSaving: true
            };
        }
        case UPDATE_SAVED_SEARCH_SUCCESS: {
            return {
                ...state,
                isSaving: false,
                savedSearches: state.savedSearches.map((savedSearch) => {
                    if (savedSearch.uuid === action.response.uuid) {
                        return action.response;
                    }
                    return savedSearch;
                })
            };
        }
        case UPDATE_SAVED_SEARCH_FAILURE: {
            return {
                ...state,
                isSaving: false
            };
        }
        case ADD_SAVED_SEARCH_BEGIN: {
            return {
                ...state,
                isSaving: true
            };
        }
        case ADD_SAVED_SEARCH_SUCCESS: {
            return {
                ...state,
                isSaving: false,
                savedSearches: [action.response, ...state.savedSearches],
                currentSavedSearch: action.response,
                totalElements: state.totalElements + 1
            };
        }
        case ADD_SAVED_SEARCH_FAILURE: {
            return {
                ...state,
                isSaving: false
            };
        }
        case RESTORE_CURRENT_SAVED_SEARCH:
        case SET_CURRENT_SAVED_SEARCH: {
            return {
                ...state,
                currentSavedSearch: action.savedSearch
            };
        }
        case RESET_SEARCH:
            return {
                ...state,
                currentSavedSearch: undefined
            };
        case SET_CAN_SAVE_SEARCH:
            return {
                ...state,
                canSaveSearch: action.canSaveSearch
            };
        default:
            return state;
    }
}

export const withoutPending = function withoutPending(state) {
    return state.savedSearches.filter((savedSearch) => !state.pending.includes(savedSearch.uuid));
};

function* fetchSavedSearches() {
    yield put({ type: FETCH_SAVED_SEARCHES_BEGIN });
    try {
        const response = yield call(userApiGet, `${AD_USER_API}/api/v1/savedsearches?size=999&sort=updated,desc`);
        yield put({ type: FETCH_SAVED_SEARCHES_SUCCESS, response });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: FETCH_SAVED_SEARCHES_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* removeSavedSearch(action) {
    try {
        yield put({ type: REMOVE_SAVED_SEARCH_BEGIN, uuid: action.uuid });
        yield call(userApiRemove, `${AD_USER_API}/api/v1/savedsearches/${action.uuid}`);
        yield put({ type: REMOVE_SAVED_SEARCH_SUCCESS, uuid: action.uuid });
        const state = yield select();
        if (state.savedSearches.currentSavedSearch && state.savedSearches.currentSavedSearch.uuid === action.uuid) {
            yield put({ type: RESET_SEARCH });
        }
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: REMOVE_SAVED_SEARCH_FAILURE, error: e, uuid: action.uuid });
        } else {
            throw e;
        }
    }
}

function* updateSavedSearch() {
    yield validateAll();
    const state = yield select();
    if (state.savedSearchForm.validation.title === undefined && state.savedSearchForm.validation.email === undefined) {
        try {
            yield put({ type: UPDATE_SAVED_SEARCH_BEGIN });
            const response = yield call(
                userApiPut,
                `${AD_USER_API}/api/v1/savedsearches/${state.savedSearchForm.formData.uuid}`, {
                    ...state.savedSearchForm.formData
                }
            );
            yield put({ type: UPDATE_SAVED_SEARCH_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: UPDATE_SAVED_SEARCH_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* addSavedSearch() {
    yield validateAll();
    const savedSearchForm = yield select((state) => state.savedSearchForm);
    if (savedSearchForm.validation.title === undefined && savedSearchForm.validation.email === undefined) {
        try {
            yield put({ type: ADD_SAVED_SEARCH_BEGIN, added: savedSearchForm.formData });
            const response = yield call(userApiPost, `${AD_USER_API}/api/v1/savedsearches`, {
                ...savedSearchForm.formData
            });
            yield put({ type: ADD_SAVED_SEARCH_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: ADD_SAVED_SEARCH_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function* setCurrentSavedSearch() {
    const state = yield select();
    yield put({
        type: RESTORE_STATE_FROM_SAVED_SEARCH,
        query: parseQueryString(state.savedSearches.currentSavedSearch.searchQuery)
    });
    if (state.search.initialSearchDone) {
        yield put({ type: SEARCH });
    }
}

function* restoreCurrentSavedSearch(action) {
    let state = yield select();
    if (action.query.saved) {
        if (state.savedSearches.shouldFetch) {
            yield put({ type: FETCH_SAVED_SEARCHES });
            yield take(FETCH_SAVED_SEARCHES_SUCCESS);
        }
        state = yield select();
        const found = state.savedSearches.savedSearches.find((savedSearch) => (
            savedSearch.uuid === action.query.saved
        ));
        if (found) {
            yield put({ type: RESTORE_CURRENT_SAVED_SEARCH, savedSearch: found });
        }
    }
    yield put({ type: RESTORE_CURRENT_SAVED_SEARCH_DONE });
}

/**
 * Hvis brukeren måtte logge inn for å kunne lagre et søk, så skal man igjen se
 * modalen for å lagre søk når man returneres fra login-siden.
 * @see handleCallbackAfterLogin
 */
function* restoreWorkflowAfterLogin() {
    let state = yield select();

    // Sørg først for at alle nødvendige data er lastet og gjennoprettet
    if (state.authentication.isAuthenticated === authenticationEnum.AUTHENTICATION_PENDING) {
        yield take(FETCH_IS_AUTHENTICATED_SUCCESS);
        state = yield select();
    }
    if (state.user.user === undefined) {
        yield take([FETCH_USER_SUCCESS, FETCH_USER_FAILURE_NO_USER]);
        state = yield select();
    }
    if (state.searchQuery.saved && state.savedSearches.shouldFetch) {
        yield take(RESTORE_CURRENT_SAVED_SEARCH_DONE);
        state = yield select();
    }

    yield put({
        type: SHOW_SAVED_SEARCH_FORM,
        formMode: state.savedSearches.currentSavedSearch ? SavedSearchFormMode.REPLACE : SavedSearchFormMode.ADD,
        showAddOrReplace: state.savedSearches.currentSavedSearch !== undefined
    });
}

function* setCanSaveSearch() {
    const state = yield select();
    const canSaveSearch = !isSearchQueryEmpty(toSavedSearchQuery(state.searchQuery));
    yield put({ type: SET_CAN_SAVE_SEARCH, canSaveSearch });
}

export const savedSearchesSaga = function* saga() {
    yield takeEvery([SEARCH, INITIAL_SEARCH, RESET_SEARCH, SET_SEARCH_STRING], setCanSaveSearch);
    yield takeEvery(FETCH_USER_SUCCESS, fetchSavedSearches);
    yield takeLatest(REMOVE_SAVED_SEARCH, removeSavedSearch);
    yield takeLatest(UPDATE_SAVED_SEARCH, updateSavedSearch);
    yield takeLatest(ADD_SAVED_SEARCH, addSavedSearch);
    yield takeLatest(RESTORE_STATE_FROM_URL, restoreCurrentSavedSearch);
    yield takeLatest(RESTORE_SAVED_SEARCH_WORKFLOW_AFTER_LOGIN, restoreWorkflowAfterLogin);
    yield takeLatest(SET_CURRENT_SAVED_SEARCH, setCurrentSavedSearch);
};
