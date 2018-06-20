import { SET_INITIAL_STATE, FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS } from '../../searchReducer';

export const CHECK_EXPIRES = 'CHECK_EXPIRES';
export const UNCHECK_EXPIRES = 'UNCHECK_EXPIRES';

const initialState = {
    expires: [],
    checkedExpires: []
};

export default function expiresReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedExpires: action.query.expires || []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                expires: action.response.expires
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                expires: state.expires.map((item) => {
                    const found = action.response.expires.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_EXPIRES:
            return {
                ...state,
                checkedExpires: [
                    ...state.checkedExpires,
                    action.value
                ]
            };
        case UNCHECK_EXPIRES:
            return {
                ...state,
                checkedExpires: state.checkedExpires.filter((m) => (m !== action.value))
            };
        default:
            return state;
    }
}
