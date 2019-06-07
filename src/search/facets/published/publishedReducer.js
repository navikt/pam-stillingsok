import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import {
    FETCH_INITIAL_FACETS_SUCCESS,
    RESET_SEARCH,
    SEARCH_SUCCESS,
    SET_FACET_PANELS_INITIAL_CLOSED
} from '../../searchReducer';

export const SET_PUBLISHED = 'SET_PUBLISHED';
export const TOGGLE_PUBLISHED_PANEL_OPEN = 'TOGGLE_PUBLISHED_PANEL_OPEN';

const initialState = {
    published: [],
    checkedPublished: undefined,
    publishedPanelOpen: true
};

export default function publishedReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            return {
                ...state,
                checkedPublished: action.query.published
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedPublished: undefined
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
        case SET_PUBLISHED:
            return {
                ...state,
                checkedPublished: action.value
            };
        case TOGGLE_PUBLISHED_PANEL_OPEN:
            return {
                ...state,
                publishedPanelOpen: !state.publishedPanelOpen
            };
        case SET_FACET_PANELS_INITIAL_CLOSED:
            return {
                ...state,
                publishedPanelOpen: false
            };
        default:
            return state;
    }
}
