import {
    RESTORE_STATE_FROM_SAVED_SEARCH,
    UPDATE_SAVED_SEARCH_SUCCESS
} from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';
import { findDeprecatedFacets, moveFacetToBottom } from '../utils';

export const CHECK_FIRST_LEVEL = 'CHECK_FIRST_LEVEL';
export const UNCHECK_FIRST_LEVEL = 'UNCHECK_FIRST_LEVEL';
export const CHECK_SECOND_LEVEL = 'CHECK_SECOND_LEVEL';
export const UNCHECK_SECOND_LEVEL = 'UNCHECK_SECOND_LEVEL';

export const OCCUPATION_ANNET = 'Uoppgitt/ ikke identifiserbare';

const initialState = {
    occupationFirstLevels: [],
    checkedFirstLevels: [],
    checkedSecondLevels: [],
    deprecatedFirstLevels: [],
    deprecatedSecondLevels: []
};

function uncheckSecondsLevels(state, firstLevel) {
    const firstLevelObject = state.occupationFirstLevels.find((c) => c.key === firstLevel);
    if (!firstLevelObject) {
        return state.checkedSecondLevels;
    }

    if (!state.checkedSecondLevels) {
        return [];
    }

    return state.checkedSecondLevels.filter((m1) =>
        !firstLevelObject.occupationSecondLevels.find((m) => m.key === m1));
};

export default function occupations(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedFirstLevels = action.query.occupationFirstLevels || [];
            const checkedSecondLevels = action.query.occupationSecondLevels || [];
            return {
                ...state,
                checkedFirstLevels,
                checkedSecondLevels,
                deprecatedFirstLevels: findDeprecatedFacets(checkedFirstLevels, state.occupationFirstLevels),
                deprecatedSecondLevels: findDeprecatedFacets(checkedSecondLevels, state.occupationFirstLevels, 'occupationSecondLevels')
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedFirstLevels: [],
                checkedSecondLevels: [],
                deprecatedFirstLevels: [],
                deprecatedSecondLevels: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                occupationFirstLevels: moveFacetToBottom(action.response.occupationFirstLevels, OCCUPATION_ANNET),
                deprecatedFirstLevels: findDeprecatedFacets(state.checkedFirstLevels,
                    action.response.occupationFirstLevels),
                deprecatedSecondLevels: findDeprecatedFacets(state.checkedSecondLevels,
                    action.response.occupationFirstLevels, 'occupationSecondLevels')
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                occupationFirstLevels: state.occupationFirstLevels.map((firstLevel) => {
                    const foundFirstLevel = action.response.occupationFirstLevels.find((c) => (
                        c.key === firstLevel.key
                    ));
                    return {
                        ...firstLevel,
                        count: foundFirstLevel ? foundFirstLevel.count : 0,
                        occupationSecondLevels: firstLevel.occupationSecondLevels.map((secondLevel) => {
                            let newSecondLevelCount = 0;
                            if (foundFirstLevel) {
                                const foundSecondLevel = foundFirstLevel.occupationSecondLevels.find((m) => (
                                    m.key === secondLevel.key
                                ));
                                newSecondLevelCount = foundSecondLevel ? foundSecondLevel.count : 0;
                            }
                            return {
                                ...secondLevel,
                                count: newSecondLevelCount
                            };
                        })
                    };
                })
            };
        case CHECK_FIRST_LEVEL:
            return {
                ...state,
                checkedFirstLevels: [
                    ...state.checkedFirstLevels,
                    action.firstLevel
                ]
            };
        case UNCHECK_FIRST_LEVEL:
            return {
                ...state,
                checkedFirstLevels: state.checkedFirstLevels.filter((c) => (c !== action.firstLevel)),
                checkedSecondLevels: uncheckSecondsLevels(state, action.firstLevel),
                from: 0
            };
        case CHECK_SECOND_LEVEL:
            return {
                ...state,
                checkedSecondLevels: [
                    ...state.checkedSecondLevels,
                    action.secondLevel
                ]
            };
        case UNCHECK_SECOND_LEVEL:
            return {
                ...state,
                checkedSecondLevels: state.checkedSecondLevels.filter((m) => (m !== action.secondLevel))
            };
        case UPDATE_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                deprecatedFirstLevels: findDeprecatedFacets(state.checkedFirstLevels, state.occupationFirstLevels),
                deprecatedSecondLevels: findDeprecatedFacets(state.checkedSecondLevels,
                    state.occupationFirstLevels, 'occupationSecondLevels')
            };
        default:
            return state;
    }
}
