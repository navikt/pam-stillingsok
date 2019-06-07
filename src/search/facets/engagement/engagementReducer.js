import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import {
    FETCH_INITIAL_FACETS_SUCCESS,
    RESET_SEARCH,
    SEARCH_SUCCESS,
    SET_FACET_PANELS_INITIAL_CLOSED
} from '../../searchReducer';
import { findDeprecatedFacets, moveFacetToBottom } from '../utils';

export const CHECK_ENGAGEMENT_TYPE = 'CHECK_ENGAGEMENT_TYPE';
export const UNCHECK_ENGAGEMENT_TYPE = 'UNCHECK_ENGAGEMENT_TYPE';
export const TOGGLE_ENGAGEMENT_PANEL_OPEN = 'TOGGLE_ENGAGEMENT_PANEL_OPEN';

const initialState = {
    engagementType: [],
    checkedEngagementType: [],
    deprecatedEngagementType: [],
    engagementPanelOpen: true
};

export default function engagementReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedEngagementType = action.query.engagementType || [];
            return {
                ...state,
                checkedEngagementType,
                deprecatedEngagementType: findDeprecatedFacets(checkedEngagementType, state.engagementType)
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedEngagementType: [],
                deprecatedEngagementType: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                engagementType: moveFacetToBottom(action.response.engagementTypes, 'Annet'),
                deprecatedEngagementType: findDeprecatedFacets(state.checkedEngagementType,
                    action.response.engagementTypes)
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                engagementType: state.engagementType.map((item) => {
                    const found = action.response.engagementTypes.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_ENGAGEMENT_TYPE:
            return {
                ...state,
                checkedEngagementType: [
                    ...state.checkedEngagementType,
                    action.value
                ]
            };
        case UNCHECK_ENGAGEMENT_TYPE:
            return {
                ...state,
                checkedEngagementType: state.checkedEngagementType.filter((m) => (m !== action.value))
            };
        case TOGGLE_ENGAGEMENT_PANEL_OPEN:
            return {
                ...state,
                engagementPanelOpen: !state.engagementPanelOpen
            };
        case SET_FACET_PANELS_INITIAL_CLOSED:
            return {
                ...state,
                engagementPanelOpen: false
            };
        default:
            return state;
    }
}
