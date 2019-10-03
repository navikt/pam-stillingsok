/* eslint-disable no-undef */
import { useEffect } from 'react';
import { CONTEXT_PATH } from '../../fasitProperties';
import SearchApiError from '../../api/SearchApiError';

export default (page, title) => {
    useEffect(() => {
        try {
            ga('set', 'page', page);
            ga('set', 'title', title);
            ga('send', 'pageview');

        } catch (e) {
            // Google Analytics er ikke definert (dette skjer f.eks. om en bruker blokkerer tracking).
        }
        sendUrlEndring({page});
    }, []);
};

const sendUrlEndring = async (page) => {
    let response;
    try {
        response = fetch({ CONTEXT_PATH } + '/instrumentation', {
            body: JSON.stringify(page),
            method: 'POST',
            referrer: CONTEXT_PATH,
            headers: {
                'Content-Type': 'application/json',
                'X-XSRF-TOKEN-ARBEIDSPLASSEN': getCookie('XSRF-TOKEN-ARBEIDSPLASSEN')
            }
        });
    } catch (e) {
        console.error(e.toString())
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
};
