import { put, takeLatest } from 'redux-saga/es/effects';
import { RESTORE_STATE_FROM_URL } from '../../urlReducer';

export const SET_VIEW_MODE = 'SET_VIEW_MODE';

const initialState = {
    mode: 'normal'
};

export default function viewModeReducer(state = initialState, action) {
    switch (action.type) {
        case SET_VIEW_MODE:
            return {
                ...state,
                mode: action.mode
            };
        default:
            return state;
    }
}

function* saveViewMode(action) {
    try {
        yield sessionStorage.setItem('mode', action.mode);
    } catch (e) {
        // Ignore session storage error
    }
}

function* readViewMode() {
    try {
        const mode = yield sessionStorage.getItem('mode');
        if (mode && mode !== null) {
            yield put({
                type: SET_VIEW_MODE,
                mode
            });
        }
    } catch (e) {
        // Ignore session storage error
    }
}

export const viewModeSaga = function* saga() {
    yield takeLatest(RESTORE_STATE_FROM_URL, readViewMode);
    yield takeLatest(SET_VIEW_MODE, saveViewMode);
};
