/* eslint-disable no-undef */
import { useEffect } from 'react';
import { CONTEXT_PATH } from '../../fasitProperties';
import {logAmplitudePageview} from "../../amplitudeTracker";

export default (page) => {
    useEffect(() => {
        try {
            logAmplitudePageview();
        } catch (e) {
            // ignore
        }
        sendUrlEndring({page});
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
