import { takeLatest } from 'redux-saga/effects';
import instrumentationApi from '../api/instrumentationApi';

export const SEND_URL_ENDRING = 'SEND_URL_ENDRING';

function* sendUrlEndring(action) {
    try {
        yield (instrumentationApi.sendUrlEndring(action.page));
    } catch (e) {
        console.error('Feil ved instrumentering av page-hit');

    }
}

function* instrumentationSaga() {
    yield takeLatest(SEND_URL_ENDRING, sendUrlEndring);
}

export { instrumentationSaga };
