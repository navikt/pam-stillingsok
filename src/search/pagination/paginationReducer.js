import { SET_INITIAL_STATE } from '../domene';

export const INCREASE_PAGINATION_FROM = 'INCREASE_PAGINATION_FROM';
export const DECREASE_PAGINATION_FROM = 'DECREASE_PAGINATION_FROM';

export const PAGE_SIZE = 20;

const initialState = {
    from: 0
};

export default function paginationReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                from: action.query.from || 0
            };
        case INCREASE_PAGINATION_FROM:
            return {
                ...state,
                from: state.from + PAGE_SIZE
            };
        case DECREASE_PAGINATION_FROM:
            return {
                ...state,
                from: state.from >= PAGE_SIZE ? state.from - PAGE_SIZE : 0
            };
        default:
            return state;
    }
}
