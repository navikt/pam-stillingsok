import { select, put, takeLatest } from 'redux-saga/effects';

export const SET_EMAIL = 'SET_EMAIL';
export const SET_EMAIL_ERROR = 'SET_EMAIL_ERROR';
export const REMOVE_EMAIL_ERROR = 'REMOVE_EMAIL_ERROR';

export const VALIDATE_EMAIL = 'VALIDATE_EMAIL';

export const epostRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const initialState = {
    email: '',
    emailError: undefined
};

export function emailReducer(state = initialState, action) {
    switch (action.type) {
        case SET_EMAIL:
            return {
                ...state,
                email: action.value
            };
        case SET_EMAIL_ERROR:
            return {
                ...state,
                emailError: action.message
            };
        case REMOVE_EMAIL_ERROR:
            return {
                ...state,
                emailError: undefined
            };
        default:
            return state;
    }
}

export function* validateEmail(action) {
    const email = yield select((state) => state.email.email);
    const { showRegisterEmail } = yield select((state) => state.savedSearchForm);
    const invalid = email && (email.length > 0) && !email.trim().match(epostRegex);
    const empty = email === undefined || email === null || email.trim().length === 0;
    if (invalid && showRegisterEmail) {
        yield put({
            type: SET_EMAIL_ERROR,
            message: 'Din e-postadresse er ikke gyldig. Pass på å fjerne alle mellomrom,' +
                ' husk å ha med @ og punktum. Eksempel: ola.nordmann@online.no'
        });
    } else if (empty && action.emailRequired && showRegisterEmail) {
        yield put({
            type: SET_EMAIL_ERROR,
            message: 'Du må skrive inn e-postadresse for å kunne få varsler på e-post'
        });
    } else {
        yield put({ type: REMOVE_EMAIL_ERROR });
    }
}

export const emailSaga = function* saga() {
    yield takeLatest(VALIDATE_EMAIL, validateEmail);
};
