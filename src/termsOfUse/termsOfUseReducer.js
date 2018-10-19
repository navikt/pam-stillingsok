export const SHOW_TERMS_OF_USE_MODAL = 'SHOW_TERMS_OF_USE_MODAL';
export const HIDE_TERMS_OF_USE_MODAL = 'HIDE_TERMS_OF_USE_MODAL';
export const SET_ACCEPT_TERMS_CHECKBOX_VALUE = 'SET_ACCEPT_TERMS_CHECKBOX_VALUE';
export const SHOW_TERMS_OF_USE_ERROR = 'SHOW_TERMS_OF_USE_ERROR';

export const CURRENT_TERMS_OF_USE = 'sok_v1';

const initialState = {
    isVisible: false,
    acceptTermsCheckboxIsChecked: false,
    validationError: false
};

export default function termsOfUseReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_TERMS_OF_USE_MODAL:
            return {
                ...state,
                isVisible: true
            };
        case SET_ACCEPT_TERMS_CHECKBOX_VALUE:
            return {
                ...state,
                acceptTermsCheckboxIsChecked: action.checked,
                validationError: !action.checked
            };
        case HIDE_TERMS_OF_USE_MODAL:
            return {
                ...state,
                isVisible: false,
                acceptTermsCheckboxIsChecked: false,
                validationError: false
            };
        case SHOW_TERMS_OF_USE_ERROR:
            return {
                ...state,
                validationError: true
            };
        default:
            return state;
    }
}

