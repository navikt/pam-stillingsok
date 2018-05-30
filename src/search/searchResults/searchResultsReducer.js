import {
    INITIAL_SEARCH_DONE,
    SEARCH_BEGIN,
    SEARCH_FAILURE,
    SEARCH_SUCCESS
} from '../searchSagas';


const initialState = {
    searchResult: {
        total: 0
    },
    initialSearchDone: false,
    isSearching: true,
    isAtLeastOneSearchDone: false,
    error: undefined
};

export default function searchResultsReducer(state = initialState, action) {
    switch (action.type) {
        case INITIAL_SEARCH_DONE:
            return {
                ...state,
                initialSearchDone: true
            };
        case SEARCH_BEGIN:
            return {
                ...state,
                isSearching: true
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                isSearching: false,
                isAtLeastOneSearchDone: true,
                searchResult: action.response
            };
        case SEARCH_FAILURE:
            return {
                ...state,
                isSearching: false,
                error: action.error
            };
        default:
            return state;
    }
}

