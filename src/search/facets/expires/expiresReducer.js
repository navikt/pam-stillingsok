import { SET_INITIAL_STATE, FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS } from '../../searchReducer';

export const SET_EXPIRES = 'SET_EXPIRES';

const initialState = {
    expires: []
};

export default function expiresReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                value: action.query.expires
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                expires: action.response.expires,
                // Bruker kan ha en gammel fasett i url, dropp å bruke denne om den ikke lengre finnes
                value: action.response.expires.find((e) => (e.key === state.value)) ? state.value : undefined
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
        case SET_EXPIRES:
            return {
                ...state,
                value: action.value
            };
        default:
            return state;
    }
}
