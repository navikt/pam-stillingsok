import { takeEvery, select, put } from 'redux-saga/es/effects';
import { CONTEXT_PATH } from '../fasitProperties';
import { getLastSearchQueryFromSessionStorage } from '../urlReducer';

export const TRACK_NAVIGATION = 'TRACK_NAVIGATION';
export const SET_BACK_LINK_URL = 'SET_BACK_LINK_URL';

const SESSION_STORAGE_KEY = "currentTopLevelPageId";

export const TopLevelPages = {
    LEDIGE_STILLINGER: {id: 'ledige-stillinger', url: CONTEXT_PATH},
    FAVORITTER: {id: 'favoritter', url: `${CONTEXT_PATH}/favoritter`},
    LAGREDE_SOK: {id: 'lagrede-sok', url: `${CONTEXT_PATH}/lagrede-sok`}
};

const initialState = {
    currentTopLevelPageId: getStoredOrDefaultTopLevelPageId(),
    backLinkUrl: TopLevelPages.LEDIGE_STILLINGER.url
};

export default function backLinkReducer(state = initialState, action) {
    switch (action.type) {
        case SET_BACK_LINK_URL:
            return {
                ...state,
                backLinkUrl: action.backLinkUrl,
                currentTopLevelPageId: action.currentTopLevelPageId
            };
        default:
            return state;
    }
}

/**
 * Sørger for å sette riktig tilbakelenke.
 */
function* handleTrackNavigation(action) {
    let backLinkUrl, currentTopLevelPageId;

    // De fleste sidene skal ha tilbakelenke til "Ledige stillinger", unntaket er om man åpner
    // en stillingsannonse fra favorittlisten, da lenker vi tilbake til "Favoritter"
    if (action.pathname === TopLevelPages.FAVORITTER.url) {
        currentTopLevelPageId = TopLevelPages.FAVORITTER.id;
        backLinkUrl = TopLevelPages.LEDIGE_STILLINGER.url + getLastSearchQueryFromSessionStorage();
    } else if (action.pathname === TopLevelPages.LEDIGE_STILLINGER.url) {
        currentTopLevelPageId = TopLevelPages.LEDIGE_STILLINGER.id;
        backLinkUrl = TopLevelPages.LEDIGE_STILLINGER.url + getLastSearchQueryFromSessionStorage();
    } else if (action.pathname === TopLevelPages.LAGREDE_SOK.url) {
        currentTopLevelPageId = TopLevelPages.LAGREDE_SOK.id;
        backLinkUrl = TopLevelPages.LEDIGE_STILLINGER.url + getLastSearchQueryFromSessionStorage();
    } else {
        const state = yield select();
        currentTopLevelPageId = state.backLink.currentTopLevelPageId;
        backLinkUrl = currentTopLevelPageId === TopLevelPages.FAVORITTER.id ?
            TopLevelPages.FAVORITTER.url :
            TopLevelPages.LEDIGE_STILLINGER.url + getLastSearchQueryFromSessionStorage();
    }

    // Lagrer currentTopLevelPageId i session storage, slik at man kan gjennopprette rikrig
    // tilbakelenke om bruker laster siden på nytt.
    sessionStorage.setItem(SESSION_STORAGE_KEY, currentTopLevelPageId);

    yield put({
        type: SET_BACK_LINK_URL,
        backLinkUrl,
        currentTopLevelPageId
    });
}

function getStoredOrDefaultTopLevelPageId() {
    const previousPageId = sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (previousPageId === TopLevelPages.FAVORITTER.id) {
        return TopLevelPages.FAVORITTER.id;
    }
    return TopLevelPages.LEDIGE_STILLINGER.id;
}

export const backLinkSaga = function* saga() {
    yield takeEvery(TRACK_NAVIGATION, handleTrackNavigation);
};
