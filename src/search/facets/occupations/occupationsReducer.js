import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';
import { moveFacetToBottom } from '../utils';

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

const findDeprecatedFirstLevels = (checkedFirstLevels, occupationFirstLevels) => (
    checkedFirstLevels.filter((checkedFirstLevel) => (
        !occupationFirstLevels.map((o) => o.key).includes(checkedFirstLevel) ? checkedFirstLevel : undefined
    ))
);

const findDeprecatedSecondLevels = (checkedSecondLevels, occupationFirstLevels) => (
    checkedSecondLevels.map((checkedSecondLevel) => {
        const occupation = checkedSecondLevel.split('.');
        const firstLevel = occupationFirstLevels.find((o) => o.key === occupation[0]);
        if (firstLevel) {
            return !firstLevel.occupationSecondLevels.map((o) => o.key).includes(checkedSecondLevel)
                ? occupation[1]
                : undefined;
        }
        return occupation[1];
    }).filter((o) => o !== undefined)
);

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
                deprecatedFirstLevels: findDeprecatedFirstLevels(checkedFirstLevels, state.occupationFirstLevels),
                deprecatedSecondLevels: findDeprecatedSecondLevels(checkedSecondLevels, state.occupationFirstLevels)
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
                deprecatedFirstLevels: findDeprecatedFirstLevels(state.checkedFirstLevels,
                    action.response.occupationFirstLevels),
                deprecatedSecondLevels: findDeprecatedSecondLevels(state.checkedSecondLevels,
                    action.response.occupationFirstLevels)
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
                ],
                deprecatedFirstLevels: [],
                deprecatedSecondLevels: []
            };
        case UNCHECK_FIRST_LEVEL:
            const firstLevelObject = state.occupationFirstLevels.find((c) => c.key === action.firstLevel);
            return {
                ...state,
                checkedFirstLevels: state.checkedFirstLevels.filter((c) => (c !== action.firstLevel)),
                checkedSecondLevels: state.checkedSecondLevels ? state.checkedSecondLevels.filter((m1) =>
                    !firstLevelObject.occupationSecondLevels.find((m) => m.key === m1)) : [],
                from: 0,
                deprecatedFirstLevels: [],
                deprecatedSecondLevels: []
            };
        case CHECK_SECOND_LEVEL:
            return {
                ...state,
                checkedSecondLevels: [
                    ...state.checkedSecondLevels,
                    action.secondLevel
                ],
                deprecatedFirstLevels: [],
                deprecatedSecondLevels: []
            };
        case UNCHECK_SECOND_LEVEL:
            return {
                ...state,
                checkedSecondLevels: state.checkedSecondLevels.filter((m) => (m !== action.secondLevel)),
                deprecatedFirstLevels: [],
                deprecatedSecondLevels: []
            };
        default:
            return state;
    }
}
