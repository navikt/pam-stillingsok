import { put, select, take, takeLatest } from 'redux-saga/es/effects';
import { requiresAuthentication } from '../../authentication/authenticationReducer';
import AuthenticationCaller from '../../authentication/AuthenticationCaller';
import { toReadableSearchQuery, toSavedSearchQuery } from '../../search/searchQueryReducer';
import { stringifyQueryObject } from '../../utils';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import SavedSearchStatusEnum from '../enums/SavedSearchStatusEnum';
import {
    ADD_SAVED_SEARCH_FAILURE,
    ADD_SAVED_SEARCH_SUCCESS,
    UPDATE_SAVED_SEARCH_FAILURE,
    UPDATE_SAVED_SEARCH_SUCCESS
} from '../savedSearchesReducer';
import { SHOW_TERMS_OF_USE_MODAL, HIDE_TERMS_OF_USE_MODAL, CREATE_USER_SUCCESS } from '../../user/userReducer';
import { isValidEmail } from '../../utils';

export const SHOW_SAVED_SEARCH_FORM = 'SHOW_SAVED_SEARCH_FORM';
export const SHOW_SAVED_SEARCH_FORM_SUCCESS = 'SHOW_SAVED_SEARCH_FORM_SUCCESS';
export const HIDE_SAVED_SEARCH_FORM = 'HIDE_SAVED_SEARCH_FORM';
export const SET_SHOW_REGISTER_EMAIL = 'SET_SHOW_REGISTER_EMAIL';
export const SET_SAVED_SEARCH_FORM_MODE = 'SET_SAVED_SEARCH_FORM_MODE';
export const SET_FORM_DATA = 'SET_FORM_DATA';
export const SET_SAVED_SEARCH_TITLE = 'SET_SAVED_SEARCH_TITLE';
export const SET_SAVED_SEARCH_NOTIFY_TYPE = 'SET_SAVED_SEARCH_NOTIFY_TYPE';
export const SET_SAVED_SEARCH_DURATION = 'SET_SAVED_SEARCH_DURATION';
export const SET_SAVED_SEARCH_QUERY = 'SET_SAVED_SEARCH_QUERY';
export const SET_ERROR = 'SET_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';
export const VALIDATE_EMAIL = 'VALIDATE_EMAIL';
export const SET_EMAIL_INPUT_VALUE = 'SET_EMAIL_INPUT_VALUE';

export const SavedSearchFormMode = {
    ADD: 'ADD',
    EDIT: 'EDIT',
    REPLACE: 'REPLACE'
};

const initialState = {
    showSavedSearchForm: false,
    formMode: SavedSearchFormMode.ADD,
    formData: undefined,
    validation: {},
    showAddOrReplace: false,
    showRegisterEmail: false,
    emailInputValue: undefined
};

export default function savedSearchFormReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_SAVED_SEARCH_FORM_SUCCESS:
            return {
                ...state,
                showAddOrReplace: action.showAddOrReplace,
                showSavedSearchForm: true,
                formMode: action.formMode,
                showRegisterEmail: false,
                emailInputValue: undefined
            };
        case SET_SHOW_REGISTER_EMAIL:
            return {
                ...state,
                showRegisterEmail: action.showRegisterEmail
            };
        case SET_EMAIL_INPUT_VALUE:
            return {
                ...state,
                emailInputValue: action.email
            };
        case HIDE_SAVED_SEARCH_FORM:
            return {
                ...state,
                showSavedSearchForm: false
            };
        case UPDATE_SAVED_SEARCH_SUCCESS:
        case UPDATE_SAVED_SEARCH_FAILURE:
        case ADD_SAVED_SEARCH_SUCCESS:
        case ADD_SAVED_SEARCH_FAILURE:
            return {
                ...state
            };
        case SET_SAVED_SEARCH_FORM_MODE:
            return {
                ...state,
                formMode: action.formMode
            };
        case SET_FORM_DATA: {
            return {
                ...state,
                formData: action.formData
            };
        }
        case SET_SAVED_SEARCH_TITLE: {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    title: action.title
                }
            };
        }
        case SET_SAVED_SEARCH_NOTIFY_TYPE: {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    notifyType: action.notifyType,
                    duration: action.notifyType === NotifyTypeEnum.NONE ? 0 : 30,
                    status: action.notifyType === NotifyTypeEnum.NONE ?
                        SavedSearchStatusEnum.INACTIVE : SavedSearchStatusEnum.ACTIVE
                }
            };
        }
        case SET_SAVED_SEARCH_DURATION: {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    duration: parseInt(action.duration, 10)
                }
            };
        }
        case SET_SAVED_SEARCH_QUERY: {
            return {
                ...state,
                formData: {
                    ...state.formData,
                    searchQuery: action.searchQuery
                }
            };
        }
        case SET_ERROR:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    [action.field]: action.message
                }
            };
        case REMOVE_ERROR:
            return {
                ...state,
                validation: {
                    ...state.validation,
                    [action.field]: undefined
                }
            };
        default:
            return state;
    }
}

function* validateTitle() {
    const state = yield select();
    const titleIsSet = state.savedSearchForm.formData.title.trim().length > 0;
    const titleIsToLong = state.savedSearchForm.formData.title.length > 255;
    if (!titleIsSet) {
        yield put({ type: SET_ERROR, field: 'title', message: 'Du må gi et navn på søket' });
    } else if (titleIsToLong) {
        yield put({ type: SET_ERROR, field: 'title', message: 'Tittelen kan ikke overstige 255 tegn' });
    } else {
        yield put({ type: REMOVE_ERROR, field: 'title' });
    }
}

function* validateEmail() {
    const { emailInputValue, showRegisterEmail } = yield select((state) => state.savedSearchForm);
    const invalid = emailInputValue && (emailInputValue.length > 0) && !isValidEmail(emailInputValue);
    const empty = emailInputValue === undefined || emailInputValue === null || emailInputValue.trim().length === 0;

    if (invalid && showRegisterEmail) {
        yield put({
            type: SET_ERROR,
            field: 'email',
            message: 'E-postadressen er ugyldig. Den må minimum inneholde en «@» og et punktum. '
            + 'Den kan ikke inneholde noen mellomrom. For eksempel: navn.navnesen@gmail.com'
        });
    } else if (empty && showRegisterEmail) {
        yield put({
            type: SET_ERROR,
            field: 'email',
            message: 'Du må skrive inn e-postadresse for å kunne få varsler på e-post'
        });
    } else {
        yield put({ type: REMOVE_ERROR, field: 'email' });
    }
}


export function* validateAll() {
    yield validateTitle();
    yield validateEmail();
}

function toTitle(state) {
    const newTitle = toReadableSearchQuery(state.searchQuery);
    return newTitle.length > 255 ? `${newTitle.substr(0, 252)}...` : newTitle;
}

function* setDefaultFormData(action) {
    const state = yield select();
    if (action.formData && action.formData.notifyType === NotifyTypeEnum.EMAIL) {
        const { email } = state.user.user;
        const emailNotSet = email === undefined || email === null || email.trim().length === 0;
        yield put({ type: SET_SHOW_REGISTER_EMAIL, showRegisterEmail: emailNotSet });
    }
    if (action.formMode === SavedSearchFormMode.ADD) {
        yield put({
            type: SET_FORM_DATA,
            formData: {
                title: toTitle(state),
                searchQuery: stringifyQueryObject(toSavedSearchQuery(state.searchQuery)),
                notifyType: NotifyTypeEnum.NONE,
                status: SavedSearchStatusEnum.INACTIVE
            }
        });
    } else if (action.formMode === SavedSearchFormMode.EDIT) {
        yield put({
            type: SET_FORM_DATA,
            formData: action.formData
        });
    } else if (action.formMode === SavedSearchFormMode.REPLACE) {
        yield put({
            type: SET_FORM_DATA,
            formData: {
                ...state.savedSearches.currentSavedSearch,
                searchQuery: stringifyQueryObject(toSavedSearchQuery(state.searchQuery))
            }
        });
    }

    // TODO: trenger vi denne?
    yield validateAll();
}

function* showSavedSearchForm(action) {
    if (yield requiresAuthentication(AuthenticationCaller.SAVE_SEARCH, { callbackId: 'save-search' })) {
        let state = yield select();
        if (!state.user.user) {
            yield put({ type: SHOW_TERMS_OF_USE_MODAL });
            yield take([HIDE_TERMS_OF_USE_MODAL, CREATE_USER_SUCCESS]);
        }
        state = yield select();
        if (state.user.user) {
            yield setDefaultFormData(action);
            yield put({
                type: SHOW_SAVED_SEARCH_FORM_SUCCESS,
                formMode: action.formMode,
                showAddOrReplace: action.showAddOrReplace
            });
        }
    }
}

export const savedSearchFormSaga = function* saga() {
    yield takeLatest([SET_SAVED_SEARCH_TITLE, SET_FORM_DATA], validateTitle);
    yield takeLatest(VALIDATE_EMAIL, validateEmail);
    yield takeLatest(SHOW_SAVED_SEARCH_FORM, showSavedSearchForm);
    yield takeLatest(SET_SAVED_SEARCH_FORM_MODE, setDefaultFormData);
};
