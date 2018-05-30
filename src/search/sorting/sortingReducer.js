import { SET_INITIAL_STATE } from '../domene';

export const SET_SORTING = 'SET_SORTING';

const initialState = {
    sort: ''
};

export default function sortingReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                sort: action.query.sort ? action.query.sort : ''
            };
        case SET_SORTING:
            return {
                ...state,
                sort: action.sortField
            };
        default:
            return state;
    }
}
