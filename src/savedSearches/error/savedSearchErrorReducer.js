import {
    ADD_SAVED_SEARCH_FAILURE,
    FETCH_SAVED_SEARCHES,
    FETCH_SAVED_SEARCHES_FAILURE,
    REMOVE_SAVED_SEARCH_FAILURE, UPDATE_SAVED_SEARCH_FAILURE
} from '../savedSearchesReducer';

export const SavedSearchErrorEnum = {
    FETCH_ERROR: 'FETCH_ERROR',
    REMOVE_ERROR: 'REMOVE_ERROR',
    UPDATE_ERROR: 'UPDATE_ERROR',
    ADD_ERROR: 'ADD_ERROR'
};

const initialState = {
    error: undefined
};

export default function savedSearchErrorReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_SAVED_SEARCHES:
            return {
                ...state,
                error: undefined
            };
        case FETCH_SAVED_SEARCHES_FAILURE:
            return {
                ...state,
                error: SavedSearchErrorEnum.FETCH_ERROR
            };
        case REMOVE_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                error: SavedSearchErrorEnum.REMOVE_ERROR
            };
        case UPDATE_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                error: SavedSearchErrorEnum.UPDATE_ERROR
            };
        case ADD_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                error: SavedSearchErrorEnum.ADD_ERROR
            };
        default:
            return state;
    }
}

