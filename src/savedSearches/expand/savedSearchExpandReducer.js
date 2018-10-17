export const EXPAND_SAVED_SEARCHES = 'EXPAND_SAVED_SEARCHES';
export const COLLAPSE_SAVED_SEARCHES = 'COLLAPSE_SAVED_SEARCHES';

const initialState = {
    isSavedSearchesExpanded: false
};

export default function savedSearchExpandReducer(state = initialState, action) {
    switch (action.type) {
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
