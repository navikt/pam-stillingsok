import { CONTEXT_PATH } from '../fasitProperties';
import SearchApiError from './SearchApiError';

const sendUrlEndring = async (page) => {
    let response;
    try {
        response = fetch({CONTEXT_PATH} + '/instrumentation', {
            credentials: 'include',
            body: JSON.stringify(page),
            method: 'POST',
            referrer: CONTEXT_PATH,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN-ARBEIDSPLASSEN': getCookie('XSRF-TOKEN-ARBEIDSPLASSEN')
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 201) {
        throw new SearchApiError(response.statusText, response.status);
    }
};

export default {
    sendUrlEndring
}

