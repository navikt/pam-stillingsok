import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';

export const CHECK_PUBLISHED = 'CHECK_PUBLISHED';
export const UNCHECK_PUBLISHED = 'UNCHECK_PUBLISHED';

const initialState = {
    published: [],
    checkedPublished: []
};

export default function publishedReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            return {
                ...state,
                checkedPublished: action.query.published || []
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedPublished: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                published: action.response.published
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                published: state.published.map((item) => {
                    const found = action.response.published.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_PUBLISHED:
            return {
                ...state,
                checkedPublished: [
                    ...state.checkedPublished,
                    action.value
                ]
            };
        case UNCHECK_PUBLISHED:
            return {
                ...state,
                checkedPublished: state.checkedPublished.filter((m) => (m !== action.value))
            };
        default:
            return state;
    }
}
