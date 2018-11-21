import {
    RESTORE_STATE_FROM_SAVED_SEARCH,
    UPDATE_SAVED_SEARCH_SUCCESS
} from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';
import { moveFacetToBottom } from '../utils';

export const CHECK_ENGAGEMENT_TYPE = 'CHECK_ENGAGEMENT_TYPE';
export const UNCHECK_ENGAGEMENT_TYPE = 'UNCHECK_ENGAGEMENT_TYPE';

export const UNCHECK_DEPRECATED_ENGAGEMENT_TYPE = 'UNCHECK_DEPRECATED_ENGAGEMENT_TYPE';

const initialState = {
    engagementType: [],
    checkedEngagementType: [],
    deprecatedEngagementType: []
};

const findDeprecatedEngagementType = (checkedEngagementType, engagementTypes) =>
    checkedEngagementType.filter((type) => !engagementTypes.map((e) => e.key).includes(type));

export default function engagementReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedEngagementType = action.query.engagementType || [];
            return {
                ...state,
                checkedEngagementType,
                deprecatedEngagementType: findDeprecatedEngagementType(checkedEngagementType, state.engagementType)
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
                deprecatedEngagementType: findDeprecatedEngagementType(state.checkedEngagementType,
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
        case UPDATE_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                deprecatedEngagementType: findDeprecatedEngagementType(state.checkedEngagementType,
                    state.engagementType)
            };
        case UNCHECK_DEPRECATED_ENGAGEMENT_TYPE:
            return {
                ...state,
                checkedEngagementType: state.checkedEngagementType.filter((e) => e !== action.deprecated)
            };
        default:
            return state;
    }
}
