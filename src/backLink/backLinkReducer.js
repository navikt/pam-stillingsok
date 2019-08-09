import { takeEvery } from 'redux-saga/es/effects';
import { CONTEXT_PATH } from '../fasitProperties';
import { getLastSearchQueryFromSessionStorage } from '../search/searchQueryReducer';

export const TRACK_NAVIGATION = 'TRACK_NAVIGATION';

const SESSION_STORAGE_KEY = "currentTopLevelPath";
const URL_LEDIGE_STILLINGER = CONTEXT_PATH;
const TOP_LEVEL_PATHS = [URL_LEDIGE_STILLINGER, `${CONTEXT_PATH}/favoritter`, `${CONTEXT_PATH}/lagrede-sok`];

const initialState = {
    currentTopLevelPath: sessionStorage.getItem(SESSION_STORAGE_KEY) || URL_LEDIGE_STILLINGER,
    backLinkUrl: URL_LEDIGE_STILLINGER
};

export default function backLinkReducer(state = initialState, action) {
    switch (action.type) {
        case TRACK_NAVIGATION:
            return {
                ...state,
                backLinkUrl: (TOP_LEVEL_PATHS.includes(action.pathname) || state.currentTopLevelPath === URL_LEDIGE_STILLINGER)
                    ? URL_LEDIGE_STILLINGER + getLastSearchQueryFromSessionStorage()
                    : state.currentTopLevelPath,
                currentTopLevelPath: TOP_LEVEL_PATHS.includes(action.pathname) ? action.pathname : state.currentTopLevelPath
            };
        default:
            return state;
    }
}

function* storeCurrentTopLevelPath(action) {
    if (TOP_LEVEL_PATHS.includes(action.pathname)) {
        sessionStorage.setItem(SESSION_STORAGE_KEY, action.pathname);
    }
}

export const backLinkSaga = function* saga() {
    yield takeEvery(TRACK_NAVIGATION, storeCurrentTopLevelPath);
};
