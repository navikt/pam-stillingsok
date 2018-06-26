import { SET_INITIAL_STATE, FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS } from '../../searchReducer';
import { moveFacetToBottom, removeNonExistingFacets } from '../utils';

export const CHECK_FIRST_LEVEL = 'CHECK_FIRST_LEVEL';
export const UNCHECK_FIRST_LEVEL = 'UNCHECK_FIRST_LEVEL';
export const CHECK_SECOND_LEVEL = 'CHECK_SECOND_LEVEL';
export const UNCHECK_SECOND_LEVEL = 'UNCHECK_SECOND_LEVEL';

export const OCCUPATION_ANNET = 'Uoppgitt/ ikke identifiserbare';

const initialState = {
    occupationFirstLevels: [],
    checkedFirstLevels: [],
    checkedSecondLevels: []
};

export default function occupations(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedFirstLevels: action.query.occupationFirstLevels || [],
                checkedSecondLevels: action.query.occupationSecondLevels || []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                occupationFirstLevels: moveFacetToBottom(action.response.occupationFirstLevels, OCCUPATION_ANNET),
                checkedFirstLevels: removeNonExistingFacets(
                    state.checkedFirstLevels,
                    action.response.occupationFirstLevels
                ),
                checkedSecondLevels: removeNonExistingFacets(
                    state.checkedSecondLevels,
                    action.response.occupationFirstLevels,
                    'occupationSecondLevels'
                )
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
            const firstLevelObject = state.occupationFirstLevels.find((c) => c.key === action.firstLevel);
            return {
                ...state,
                checkedFirstLevels: state.checkedFirstLevels.filter((c) => (c !== action.firstLevel)),
                checkedSecondLevels: state.checkedSecondLevels ? state.checkedSecondLevels.filter((m1) =>
                    !firstLevelObject.occupationSecondLevels.find((m) => m.key === m1)) : [],
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
        default:
            return state;
    }
}
