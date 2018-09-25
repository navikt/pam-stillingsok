import { RESTORE_STATE_FROM_URL } from '../../urlReducer';
import { RESET_SEARCH } from '../searchReducer';

export const SET_SORTING = 'SET_SORTING';

const initialState = {
    sort: ''
};

export default function sortingReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
            return {
                ...state,
                sort: action.query.sort || ''
            };
        case RESET_SEARCH:
            return {
                ...state,
                sort: ''
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
