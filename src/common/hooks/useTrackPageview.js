/* eslint-disable no-undef */
import { useEffect } from 'react';
import { CONTEXT_PATH } from '../../fasitProperties';

export default (page, title) => {
    useEffect(() => {
        try {
            ga('set', 'page', page);
            ga('set', 'title', title);
            ga('send', 'pageview');

            if(sessionStorage.getItem('trackedRole') !== 'true') {
                sessionStorage.setItem('trackedRole', 'true');
                const role = localStorage.getItem('innloggetBrukerKontekst');
                ga('send', 'event', 'Ledige stillinger', 'Rolle', role || 'unknown', {
                    nonInteraction: true
                });
            }
        } catch (e) {
            // Google Analytics er ikke definert (dette skjer f.eks. om en bruker blokkerer tracking).
        }
        sendUrlEndring({page});
    }, []);
};

const sendUrlEndring = (page) => {
    try {
        fetch(`${CONTEXT_PATH}/instrumentation`, {
            body: JSON.stringify(page),
            method: 'POST',
            referrer: CONTEXT_PATH,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        // ignore
    }
};
