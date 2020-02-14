/* eslint-disable no-undef */
import { useEffect } from 'react';
import { CONTEXT_PATH } from '../../fasitProperties';

export default (page, title) => {
    useEffect(() => {
        try {
            ga('set', 'page', page);
            ga('set', 'title', title);
            ga('send', 'pageview');

            if(window.trackedRole === undefined) {
                const role = localStorage.getItem('innloggetBrukerKontekst');
                if(role) {
                    window.trackedRole = true;
                    ga('send', 'event', 'Ledige stillinger', 'Rolle', role, {
                        nonInteraction: true
                    });
                }
            }
        } catch (e) {
            // Google Analytics er ikke definert (dette skjer f.eks. om en bruker blokkerer tracking).
        }
        // Sender ikke eventer herfra om de kommer fra stilling. Eventer fra stilling blir lagret gjennom
        // useEffect i Stilling.js
        if (title !== 'Stilling') {
            sendUrlEndring({page});
        }
    }, []);
};

export const sendUrlEndring = (payload) => {
    try {
        fetch(`${CONTEXT_PATH}/instrumentation`, {
            body: JSON.stringify(payload),
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
