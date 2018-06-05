import { SET_INITIAL_STATE, FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS } from '../../searchReducer';

export const CHECK_CREATED = 'CHECK_CREATED';
export const UNCHECK_CREATED = 'UNCHECK_CREATED';

const initialState = {
    created: [],
    checkedCreated: []
};

export default function createdReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedCreated: action.query.created || []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                created: action.response.created
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                created: state.created.map((item) => {
                    const found = action.response.created.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_CREATED:
            return {
                ...state,
                checkedCreated: [
                    ...state.checkedCreated,
                    action.value
                ]
            };
        case UNCHECK_CREATED:
            return {
                ...state,
                checkedCreated: state.checkedCreated.filter((m) => (m !== action.value))
            };
        default:
            return state;
    }
}
