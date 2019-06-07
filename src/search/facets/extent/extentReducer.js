import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import {
    FETCH_INITIAL_FACETS_SUCCESS,
    RESET_SEARCH,
    SEARCH_SUCCESS,
    SET_FACET_PANELS_INITIAL_OPEN
} from '../../searchReducer';
import { findDeprecatedFacets } from '../utils';

export const CHECK_EXTENT = 'CHECK_EXTENT';
export const UNCHECK_EXTENT = 'UNCHECK_EXTENT';
export const TOGGLE_EXTENT_PANEL_OPEN = 'TOGGLE_EXTENT_PANEL_OPEN';

const initialState = {
    extent: [],
    checkedExtent: [],
    deprecatedExtent: [],
    extentPanelOpen: true
};

export default function extentReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedExtent = action.query.extent || [];
            return {
                ...state,
                checkedExtent,
                deprecatedExtent: findDeprecatedFacets(checkedExtent, state.extent)
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedExtent: [],
                deprecatedExtent: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                extent: action.response.extent,
                deprecatedExtent: findDeprecatedFacets(state.checkedExtent, action.response.extent)
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                extent: state.extent.map((item) => {
                    const found = action.response.extent.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_EXTENT:
            return {
                ...state,
                checkedExtent: [
                    ...state.checkedExtent,
                    action.value
                ]
            };
        case UNCHECK_EXTENT:
            return {
                ...state,
                checkedExtent: state.checkedExtent.filter((m) => (m !== action.value))
            };
        case TOGGLE_EXTENT_PANEL_OPEN:
            return {
                ...state,
                extentPanelOpen: !state.extentPanelOpen
            };
        case SET_FACET_PANELS_INITIAL_OPEN:
            return {
                ...state,
                extentPanelOpen: action.isOpen
            };
        default:
            return state;
    }
}
