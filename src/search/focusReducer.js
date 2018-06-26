import { LOAD_MORE_SUCCESS, RESET_FROM, SET_MODE } from './searchReducer';
import { FETCH_STILLING_BEGIN } from '../stilling/stillingReducer';

const initialState = {
    restoreFocusToUuid: undefined
};

export default function focusReducer(state = initialState, action) {
    switch (action.type) {
        case SET_MODE:
        case RESET_FROM: {
            return {
                ...state,
                restoreFocusToUuid: undefined
            };
        }
        case FETCH_STILLING_BEGIN: {
            return {
                ...state,
                restoreFocusToUuid: action.uuid
            };
        }
        case LOAD_MORE_SUCCESS: {
            return {
                ...state,
                restoreFocusToUuid: action.response.stillinger[0].uuid
            };
        }
        default:
            return state;
    }
}
