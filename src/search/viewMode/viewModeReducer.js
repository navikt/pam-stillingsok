import { RESTORE_STATE_FROM_URL } from '../../urlReducer';

export const SET_VIEW_MODE = 'SET_VIEW_MODE';

const initialState = {
    mode: 'normal'
};

export default function viewModeReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
            return {
                ...state,
                mode: action.query.mode ? action.query.mode : 'normal'
            };
        case SET_VIEW_MODE:
            return {
                ...state,
                mode: action.mode
            };
        default:
            return state;
    }
}
