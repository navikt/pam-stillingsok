export const SHOW_AUTHORIZATION_ERROR_MODAL = 'SHOW_AUTHORIZATION_ERROR_MODAL';
export const HIDE_AUTHORIZATION_ERROR_MODAL = 'FETCH_AUTHENTICATION_BEGIN';

const initialState = {
    text: '',
    isVisible: false
};

export default function authenticationModalReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_AUTHORIZATION_ERROR_MODAL:
            return {
                ...state,
                text: action.text,
                isVisible: true
            };
        case HIDE_AUTHORIZATION_ERROR_MODAL:
            return {
                ...state,
                isVisible: false
            };
        default:
            return state;
    }
}
