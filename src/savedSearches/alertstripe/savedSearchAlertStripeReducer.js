import { takeLatest, call, put } from 'redux-saga/effects';
import {
    ADD_SAVED_SEARCH_FAILURE,
    ADD_SAVED_SEARCH_SUCCESS,
    FETCH_SAVED_SEARCHES,
    REMOVE_SAVED_SEARCH_BEGIN,
    REMOVE_SAVED_SEARCH_FAILURE,
    SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL,
    UPDATE_SAVED_SEARCH_FAILURE,
    UPDATE_SAVED_SEARCH_SUCCESS
} from '../savedSearchesReducer';

export const SHOW_SAVED_SEARCH_ALERT_STRIPE = 'SHOW_SAVED_SEARCH_ALERT_STRIPE';
export const HIDE_SAVED_SEARCH_ALERT_STRIPE = 'HIDE_SAVED_SEARCH_ALERT_STRIPE';

export const SavedSearchAlertStripeMode = {
    ADDED: 'ADDED',
    UPDATED: 'UPDATED',
    REMOVED: 'REMOVED'
};

let delayTimeout;

const initialState = {
    showAlertStripe: false,
    alertStripeMode: 'added'
};

export default function savedSearchAlertStripeReducer(state = initialState, action) {
    switch (action.type) {
        case SHOW_SAVED_SEARCH_ALERT_STRIPE:
            return {
                ...state,
                showAlertStripe: true
            };
        case HIDE_SAVED_SEARCH_ALERT_STRIPE:
            return {
                ...state,
                showAlertStripe: false
            };
        case ADD_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                alertStripeMode: SavedSearchAlertStripeMode.ADDED
            };
        case UPDATE_SAVED_SEARCH_SUCCESS:
            return {
                ...state,
                alertStripeMode: SavedSearchAlertStripeMode.UPDATED
            };
        case REMOVE_SAVED_SEARCH_BEGIN:
            return {
                ...state,
                alertStripeMode: SavedSearchAlertStripeMode.REMOVED
            };
        case FETCH_SAVED_SEARCHES:
        case SHOW_CONFIRM_REMOVE_SAVED_SEARCH_MODAL:
        case REMOVE_SAVED_SEARCH_FAILURE:
        case UPDATE_SAVED_SEARCH_FAILURE:
        case ADD_SAVED_SEARCH_FAILURE:
            return {
                ...state,
                showAlertStripe: false
            };
        default:
            return state;
    }
}

const delay = (ms) => {
    if (delayTimeout) {
        clearTimeout(delayTimeout);
    }
    return new Promise((resolve) => {
        delayTimeout = setTimeout(resolve, ms);
    });
};

function* showAlertStripe() {
    yield put({ type: SHOW_SAVED_SEARCH_ALERT_STRIPE });
    yield call(delay, 5000);
    yield put({ type: HIDE_SAVED_SEARCH_ALERT_STRIPE });
}

export const savedSearchAlertStripeSaga = function* saga() {
    yield takeLatest([
        ADD_SAVED_SEARCH_SUCCESS,
        UPDATE_SAVED_SEARCH_SUCCESS,
        REMOVE_SAVED_SEARCH_BEGIN
    ], showAlertStripe);
};
