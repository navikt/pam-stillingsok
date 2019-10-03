import { takeLatest } from 'redux-saga/effects';
import { sendUrlEndring } from '../api/instrumentationApi';

export const SEND_URL_ENDRING = 'SEND_URL_ENDRING';

function* sendUrlEndring(action) {
    try {
        yield (sendUrlEndring(action.url));
    } catch (e) {
        console.error('Feil ved instrumentering av page-hit');

    }
}

function* instrumentationSaga() {
    yield takeLatest(SEND_URL_ENDRING, sendUrlEndring);
}

export { instrumentationSaga };
