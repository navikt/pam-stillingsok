export const SHOW_TERMS_OF_USE_MODAL = 'SHOW_TERMS_OF_USE_MODAL';
export const HIDE_TERMS_OF_USE_MODAL = 'HIDE_TERMS_OF_USE_MODAL';
export const ACCEPT_TERMS = 'ACCEPT_TERMS';

export const CURRENT_TERMS_OF_USE = 'sok_v1';

const initialState = {
    isVisible: false
};

export default function termsOfUseReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_TERMS_OF_USE_MODAL:
            return {
                ...state,
                isVisible: true
            };
        case HIDE_TERMS_OF_USE_MODAL:
        case ACCEPT_TERMS:
            return {
                ...state,
                isVisible: false
            };
        default:
            return state;
    }
}

