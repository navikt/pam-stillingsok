import { SET_INITIAL_STATE, FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS } from '../../searchReducer';

export const CHECK_ENGAGEMENT_TYPE = 'CHECK_ENGAGEMENT_TYPE';
export const UNCHECK_ENGAGEMENT_TYPE = 'UNCHECK_ENGAGEMENT_TYPE';

const initialState = {
    engagementType: [],
    checkedEngagementType: []
};

function reOrderFacets (array){
    array.forEach(function (item, i) {
        if(item.key === 'Annet') {
            array.push(array.splice(i, 1)[0]);
        }
    });

    return array;
};

export default function engagementReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedEngagementType: action.query.engagementType || []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                engagementType: reOrderFacets(action.response.engagementTypes)
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
        default:
            return state;
    }
}
