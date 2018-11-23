import { put, select, takeLatest } from 'redux-saga/es/effects';
import { requiresAuthentication } from '../../authentication/authenticationReducer';
import AuthenticationCaller from '../../authentication/AuthenticationCaller';
import capitalizeLocation from '../../common/capitalizeLocation';
import { toQueryString } from '../../search/url';
import NotifyTypeEnum from '../enums/NotifyTypeEnum';
import SavedSearchStatusEnum from '../enums/SavedSearchStatusEnum';
import {
    ADD_SAVED_SEARCH_FAILURE,
    ADD_SAVED_SEARCH_SUCCESS,
    toSavedSearchQuery,
    UPDATE_SAVED_SEARCH_FAILURE,
    UPDATE_SAVED_SEARCH_SUCCESS
} from '../savedSearchesReducer';

export const SHOW_SAVED_SEARCH_FORM = 'SHOW_SAVED_SEARCH_FORM';
export const HIDE_SAVED_SEARCH_FORM = 'HIDE_SAVED_SEARCH_FORM';
export const SET_SAVED_SEARCH_FORM_MODE = 'SET_SAVED_SEARCH_FORM_MODE';
export const SET_FORM_DATA = 'SET_FORM_DATA';
export const SET_SAVED_SEARCH_TITLE = 'SET_SAVED_SEARCH_TITLE';
export const SET_SAVED_SEARCH_NOTIFY_TYPE = 'SET_SAVED_SEARCH_NOTIFY_TYPE';
export const SET_SAVED_SEARCH_DURATION = 'SET_SAVED_SEARCH_DURATION';
export const SET_SAVED_SEARCH_QUERY = 'SET_SAVED_SEARCH_QUERY';
export const SET_ERROR = 'SET_ERROR';
export const REMOVE_ERROR = 'REMOVE_ERROR';

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
    showAddOrReplace: false
};

export default function savedSearchFormReducer(state = initialState, action) {
    switch (action.type) {
        // case SHOW_SAVED_SEARCH_FORM:
        //     return {
        //         ...state,
        //         // showAddOrReplace: action.showAddOrReplace,
        //         // showSavedSearchForm: true,
        //         // formMode: action.formMode
        //     };
        case HIDE_SAVED_SEARCH_FORM:
        case UPDATE_SAVED_SEARCH_SUCCESS:
        case UPDATE_SAVED_SEARCH_FAILURE:
        case ADD_SAVED_SEARCH_SUCCESS:
        case ADD_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                showSavedSearchForm: false
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

export function* validateAll() {
    yield validateTitle();
}

function toTitle(state) {
    const title = [];
    const counties = state.counties.checkedCounties.filter((county) => {
        const countyObject = state.counties.counties.find((c) => c.key === county);
        if (countyObject) {
            const found = countyObject.municipals.find((m) => state.counties.checkedMunicipals.includes(m.key));
            return !found;
        }
        return '';
    });
    const occupationFirstLevels = state.occupations.checkedFirstLevels.filter((firstLevel) => {
        const firstLevelObject = state.occupations.occupationFirstLevels.find((c) => c.key === firstLevel);
        if (firstLevelObject) {
            const found = firstLevelObject.occupationSecondLevels.find((m) => state.occupations.checkedSecondLevels.includes(m.key));
            return !found;
        }
        return '';
    });

    if (state.searchBox.q) title.push(state.searchBox.q);
    if (occupationFirstLevels.length > 0) title.push(occupationFirstLevels.join(', '));
    if (state.occupations.checkedSecondLevels.length > 0) title.push(state.occupations.checkedSecondLevels.map((o) => (o.split('.')[1])).join(', '));
    if (counties.length > 0) title.push(counties.map((c) => (capitalizeLocation(c))).join(', '));
    if (state.counties.checkedMunicipals.length > 0) title.push(state.counties.checkedMunicipals.map((m) => (capitalizeLocation(m.split('.')[1]))).join(', '));
    if (state.extent.checkedExtent.length > 0) title.push(state.extent.checkedExtent.join(', '));
    if (state.engagement.checkedEngagementType.length > 0) title.push(state.engagement.checkedEngagementType.join(', '));
    if (state.sector.checkedSector.length > 0) title.push(state.sector.checkedSector.join(', '));

    const newTitle = title.join(', ');

    return newTitle.length > 255 ? `${newTitle.substr(0, 252)}...` : newTitle;
}

function* setDefaultFormData(action) {
    if (yield requiresAuthentication(AuthenticationCaller.SAVE_SEARCH)) {
        const state = yield select();
        if (action.formMode === SavedSearchFormMode.ADD) {
            yield put({
                type: SET_FORM_DATA,
                formData: {
                    title: toTitle(state),
                    searchQuery: toQueryString(toSavedSearchQuery(state)),
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
                    searchQuery: toQueryString(toSavedSearchQuery(state))
                }
            });
        }
        yield validateAll();
    }
}

export const savedSearchFormSaga = function* saga() {
    yield takeLatest([SET_SAVED_SEARCH_TITLE, SET_FORM_DATA], validateAll);
    yield takeLatest(SHOW_SAVED_SEARCH_FORM, setDefaultFormData);
    yield takeLatest(SET_SAVED_SEARCH_FORM_MODE, setDefaultFormData);
};
