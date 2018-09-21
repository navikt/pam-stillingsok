import { call, put, select, takeLatest } from 'redux-saga/effects';
import { get, post, put as fetchPut, remove, SearchApiError } from '../api/api';
import capitalizeLocation from '../common/capitalizeLocation';
import { AD_USER_API } from '../fasitProperties';
import { USER_UUID_HACK } from '../favorites/favoritesReducer';
import { toUrl } from '../search/url';
import NotifyTypeEnum from './enums/NotifyTypeEnum';
import SavedSearchStatusEnum from './enums/SavedSearchStatusEnum';

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

export const SHOW_SAVED_SEARCHES_STRIPE = 'SHOW_SAVED_SEARCHES_STRIPE';
export const HIDE_SAVED_SEARCHES_STRIPE = 'HIDE_SAVED_SEARCHES_STRIPE';

export const SHOW_EDIT_SAVED_SEARCH_MODAL = 'SHOW_EDIT_SAVED_SEARCH_MODAL';
export const HIDE_EDIT_SAVED_SEARCH_MODAL = 'HIDE_EDIT_SAVED_SEARCH_MODAL';
export const SET_SAVED_SEARCH_TITLE = 'SET_SAVED_SEARCH_TITLE';
export const SET_SAVED_SEARCH_NOTIFY_TYPE = 'SET_SAVED_SEARCH_NOTIFY_TYPE';
export const SET_SAVED_SEARCH_DURATION = 'SET_SAVED_SEARCH_DURATION';

export const UPDATE_SAVED_SEARCH = 'UPDATE_SAVED_SEARCH';
export const UPDATE_SAVED_SEARCH_BEGIN = 'UPDATE_SAVED_SEARCH_BEGIN';
export const UPDATE_SAVED_SEARCH_SUCCESS = 'UPDATE_SAVED_SEARCH_SUCCESS';
export const UPDATE_SAVED_SEARCH_FAILURE = 'UPDATE_SAVED_SEARCH_FAILURE';

export const SHOW_ADD_SAVED_SEARCH_MODAL = 'SHOW_ADD_SAVED_SEARCH_MODAL';
export const HIDE_ADD_SAVED_SEARCH_MODAL = 'HIDE_ADD_SAVED_SEARCH_MODAL';
export const ADD_SAVED_SEARCH = 'ADD_SAVED_SEARCH';
export const ADD_SAVED_SEARCH_BEGIN = 'ADD_SAVED_SEARCH_BEGIN';
export const ADD_SAVED_SEARCH_SUCCESS = 'ADD_SAVED_SEARCH_SUCCESS';
export const ADD_SAVED_SEARCH_FAILURE = 'ADD_SAVED_SEARCH_FAILURE';
export const ADD_SAVED_SEARCH_TITLE = 'ADD_SAVED_SEARCH_TITLE';
export const ADD_SAVED_SEARCH_NOTIFY_TYPE = 'ADD_SAVED_SEARCH_NOTIFY_TYPE';
export const ADD_SAVED_SEARCH_DURATION = 'ADD_SAVED_SEARCH_DURATION';
export const ADD_SAVED_SEARCH_QUERY = 'ADD_SAVED_SEARCH_QUERY';

export const EXPAND_SAVED_SEARCHES = 'EXPAND_SAVED_SEARCHES';
export const COLLAPSE_SAVED_SEARCHES = 'COLLAPSE_SAVED_SEARCHES';

const initialState = {
    savedSearches: [],
    error: undefined,
    isFetchingSavedSearches: false,
    shouldFetchSavedSearches: true,
    showAlertStripe: false,
    savedSearchAboutToBeRemoved: undefined,
    alertStripeMode: 'added',
    confirmationVisible: false,
    savedSearchAboutToBeEdited: undefined,
    savedSearchAboutToBeEditedValidation: {
        titleIsValid: true
    },
    savedSearchAboutToBeAdded: undefined,
    savedSearchAboutToBeAddedValidation: {
        titleIsValid: true
    },
    showEditSavedSearchModal: false,
    showAddSavedSearchModal: false,
    isSavedSearchesExpanded: false,
    totalElements: 0,
    isSaving: false
};

export default function savedSearchesReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SAVED_SEARCHES:
            return {
                ...state,
                showAlertStripe: false,
                error: undefined
            };
        case FETCH_SAVED_SEARCHES_BEGIN:
            return {
                ...state,
                isFetchingSavedSearches: true
            };
        case FETCH_SAVED_SEARCHES_SUCCESS:
            return {
                ...state,
                savedSearches: action.response.content,
                totalElements: action.response.totalElements,
                isFetchingSavedSearches: false,
                shouldFetchSavedSearches: false
            };
        case FETCH_SAVED_SEARCHES_FAILURE:
            return {
                ...state,
                error: 'fetch_error',
                isFetchingSavedSearches: false
            };
        case REMOVE_SAVED_SEARCH_BEGIN:
            return {
                ...state,
                savedSearches: state.savedSearches.filter((savedSearch) => savedSearch.uuid !== action.uuid),
                totalItems: state.totalElements - 1
            };
        case REMOVE_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                error: 'remove_error',
                showAlertStripe: false
            };
        case SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL:
            return {
                ...state,
                showAlertStripe: false,
                confirmationVisible: true,
                savedSearchAboutToBeRemoved: state.savedSearches.find((savedSearch) => savedSearch.uuid === action.uuid)
            };
        case HIDE_MODAL_REMOVE_SAVED_SEARCH:
            return {
                ...state,
                confirmationVisible: false
            };
        case SHOW_SAVED_SEARCHES_STRIPE:
            return {
                ...state,
                alertStripeMode: action.alertStripeMode,
                showAlertStripe: true
            };
        case HIDE_SAVED_SEARCHES_STRIPE:
            return {
                ...state,
                showAlertStripe: false
            };
        case SHOW_EDIT_SAVED_SEARCH_MODAL:
            return {
                ...state,
                showEditSavedSearchModal: true,
                savedSearchAboutToBeEdited: state.savedSearches.find((savedSearch) => savedSearch.uuid === action.uuid)
            };
        case HIDE_EDIT_SAVED_SEARCH_MODAL:
            return {
                ...state,
                showEditSavedSearchModal: false
            };
        case SET_SAVED_SEARCH_TITLE: {
            return {
                ...state,
                savedSearchAboutToBeEdited: {
                    ...state.savedSearchAboutToBeEdited,
                    title: action.title
                },
                savedSearchAboutToBeEditedValidation: {
                    ...state.savedSearchAboutToBeEditedValidation,
                    titleIsValid: action.title.trim().length > 0
                }
            };
        }
        case SET_SAVED_SEARCH_NOTIFY_TYPE: {
            return {
                ...state,
                savedSearchAboutToBeEdited: {
                    ...state.savedSearchAboutToBeEdited,
                    notifyType: action.notifyType
                }
            };
        }
        case SET_SAVED_SEARCH_DURATION: {
            return {
                ...state,
                savedSearchAboutToBeEdited: {
                    ...state.savedSearchAboutToBeEdited,
                    duration: parseInt(action.duration, 10)
                }
            };
        }
        case UPDATE_SAVED_SEARCH_BEGIN: {
            return {
                ...state,
                isSaving: true,
                savedSearches: state.savedSearches.map((savedSearch) => {
                    if (savedSearch.uuid === action.updated.uuid) {
                        return state.savedSearchAboutToBeEdited;
                    }
                    return savedSearch;
                })
            };
        }
        case UPDATE_SAVED_SEARCH_SUCCESS: {
            return {
                ...state,
                isSaving: false
            };
        }
        case UPDATE_SAVED_SEARCH_FAILURE: {
            return {
                ...state,
                isSaving: false,
                error: 'update_error',
                showAlertStripe: false
            };
        }
        case SHOW_ADD_SAVED_SEARCH_MODAL:
            return {
                ...state,
                showAddSavedSearchModal: true,
                savedSearchAboutToBeAdded: {
                    title: '',
                    duration: 30,
                    notifyType: NotifyTypeEnum.EMAIL,
                    status: SavedSearchStatusEnum.ACTIVE,
                    userUuid: USER_UUID_HACK
                }
            };
        case HIDE_ADD_SAVED_SEARCH_MODAL:
            return {
                ...state,
                showAddSavedSearchModal: false
            };
        case ADD_SAVED_SEARCH_TITLE: {
            return {
                ...state,
                savedSearchAboutToBeAdded: {
                    ...state.savedSearchAboutToBeAdded,
                    title: action.title
                },
                savedSearchAboutToBeAddedValidation: {
                    ...state.savedSearchAboutToBeAddedValidation,
                    titleIsValid: action.title.trim().length > 0
                }
            };
        }
        case ADD_SAVED_SEARCH_NOTIFY_TYPE: {
            return {
                ...state,
                savedSearchAboutToBeAdded: {
                    ...state.savedSearchAboutToBeAdded,
                    notifyType: action.notifyType
                }
            };
        }
        case ADD_SAVED_SEARCH_DURATION: {
            return {
                ...state,
                savedSearchAboutToBeAdded: {
                    ...state.savedSearchAboutToBeAdded,
                    duration: parseInt(action.duration, 10)
                }
            };
        }
        case ADD_SAVED_SEARCH_QUERY: {
            return {
                ...state,
                savedSearchAboutToBeAdded: {
                    ...state.savedSearchAboutToBeAdded,
                    searchQuery: action.searchQuery
                }
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
                savedSearches: [...state.savedSearches, action.response],
                totalItems: state.totalElements + 1
            };
        }
        case ADD_SAVED_SEARCH_FAILURE: {
            return {
                ...state,
                isSaving: false,
                error: 'add_error',
                showAlertStripe: false
            };
        }
        case EXPAND_SAVED_SEARCHES: {
            return {
                ...state,
                isSavedSearchesExpanded: true
            };
        }

        case COLLAPSE_SAVED_SEARCHES: {
            return {
                ...state,
                isSavedSearchesExpanded: false
            };
        }
        default:
            return state;
    }
}

function* fetchSavedSearches() {
    const state = yield select();
    if (state.savedSearches.shouldFetchSavedSearches) {
        yield put({ type: FETCH_SAVED_SEARCHES_BEGIN });
        try {
            const response = yield call(get, `${AD_USER_API}/api/v1/savedsearches?size=200&user=${USER_UUID_HACK}`);
            yield put({ type: FETCH_SAVED_SEARCHES_SUCCESS, response });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: FETCH_SAVED_SEARCHES_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function* removeSavedSearch(action) {
    try {
        yield put({ type: SHOW_SAVED_SEARCHES_STRIPE, alertStripeMode: 'removed' });
        yield put({ type: REMOVE_SAVED_SEARCH_BEGIN, uuid: action.uuid });
        const response = yield call(remove, `${AD_USER_API}/api/v1/savedsearches/${action.uuid}`);
        yield put({ type: REMOVE_SAVED_SEARCH_SUCCESS, response });
        yield call(delay, 5000);
        yield put({ type: HIDE_SAVED_SEARCHES_STRIPE });
    } catch (e) {
        if (e instanceof SearchApiError) {
            yield put({ type: REMOVE_SAVED_SEARCH_FAILURE, error: e });
        } else {
            throw e;
        }
    }
}

function* updateSavedSearch() {
    const state = yield select();
    if (state.savedSearches.savedSearchAboutToBeEditedValidation.titleIsValid) {
        try {
            yield put({ type: UPDATE_SAVED_SEARCH_BEGIN, updated: state.savedSearches.savedSearchAboutToBeEdited });
            const response = yield call(
                fetchPut,
                `${AD_USER_API}/api/v1/savedsearches/${state.savedSearches.savedSearchAboutToBeEdited.uuid}`,
                state.savedSearches.savedSearchAboutToBeEdited
            );
            yield put({ type: HIDE_EDIT_SAVED_SEARCH_MODAL });
            yield put({ type: SHOW_SAVED_SEARCHES_STRIPE, alertStripeMode: 'edited' });
            yield put({ type: UPDATE_SAVED_SEARCH_SUCCESS, response });
            yield call(delay, 5000);
            yield put({ type: HIDE_SAVED_SEARCHES_STRIPE });
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
    const state = yield select();
    if (state.savedSearches.savedSearchAboutToBeAddedValidation.titleIsValid) {
        try {
            yield put({ type: ADD_SAVED_SEARCH_BEGIN, added: state.savedSearches.savedSearchAboutToBeAdded });
            const response = yield call(post, `${AD_USER_API}/api/v1/savedsearches`, state.savedSearches.savedSearchAboutToBeAdded);
            yield put({ type: ADD_SAVED_SEARCH_SUCCESS, response });
            yield put({ type: HIDE_ADD_SAVED_SEARCH_MODAL });
            yield put({ type: SHOW_SAVED_SEARCHES_STRIPE, alertStripeMode: 'added' });
            yield call(delay, 5000);
            yield put({ type: HIDE_SAVED_SEARCHES_STRIPE });
        } catch (e) {
            if (e instanceof SearchApiError) {
                yield put({ type: ADD_SAVED_SEARCH_FAILURE, error: e });
            } else {
                throw e;
            }
        }
    }
}

function toQuery(state) {
    return {
        q: state.searchBox.q,
        counties: state.counties.checkedCounties,
        municipals: state.counties.checkedMunicipals,
        published: state.published.checkedPublished,
        engagementType: state.engagement.checkedEngagementType,
        sector: state.sector.checkedSector,
        extent: state.extent.checkedExtent,
        occupationFirstLevels: state.occupations.checkedFirstLevels,
        occupationSecondLevels: state.occupations.checkedSecondLevels
    };
}

function toTitle(state) {
    const title = [];
    const counties = state.counties.checkedCounties.filter((county) => {
        const countyObject = state.counties.counties.find((c) => c.key === county);
        const found = countyObject.municipals.find((m) => state.counties.checkedMunicipals.includes(m.key));
        return !found;
    });
    const occupationFirstLevels = state.occupations.checkedFirstLevels.filter((firstLevel) => {
        const firstLevelObject = state.occupations.occupationFirstLevels.find((c) => c.key === firstLevel);
        const found = firstLevelObject.occupationSecondLevels.find((m) => state.occupations.checkedSecondLevels.includes(m.key));
        return !found;
    });

    if (state.searchBox.q) title.push(state.searchBox.q);
    if (occupationFirstLevels.length > 0) title.push(occupationFirstLevels.join(', '));
    if (state.occupations.checkedSecondLevels.length > 0) title.push(state.occupations.checkedSecondLevels.join(', '));
    if (counties.length > 0) title.push(counties.map((c) => (capitalizeLocation(c))).join(', '));
    if (state.counties.checkedMunicipals.length > 0) title.push(state.counties.checkedMunicipals.map((m) => (capitalizeLocation(m))).join(', '));
    if (state.extent.checkedExtent.length > 0) title.push(state.extent.checkedExtent.join(', '));
    if (state.engagement.checkedEngagementType.length > 0) title.push(state.engagement.checkedEngagementType.join(', '));
    if (state.sector.checkedSector.length > 0) title.push(state.sector.checkedSector.join(', '));
    return title.join(', ');
}

function* setTitleAndUrl() {
    const state = yield select();
    const searchQuery = toUrl(toQuery(state));
    const title = toTitle(state);
    yield put({ type: ADD_SAVED_SEARCH_QUERY, searchQuery });
    yield put({ type: ADD_SAVED_SEARCH_TITLE, title });
}

export const savedSearchesSaga = function* saga() {
    yield takeLatest(FETCH_SAVED_SEARCHES, fetchSavedSearches);
    yield takeLatest(REMOVE_SAVED_SEARCH, removeSavedSearch);
    yield takeLatest(UPDATE_SAVED_SEARCH, updateSavedSearch);
    yield takeLatest(ADD_SAVED_SEARCH, addSavedSearch);
    yield takeLatest(SHOW_ADD_SAVED_SEARCH_MODAL, setTitleAndUrl);
};
