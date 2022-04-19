/* eslint-disable no-undef */
import {useEffect} from "react";
import {CONTEXT_PATH} from "../environment";
import {logAmplitudePageview} from "../utils/amplitudeTracker";

export default (page) => {
    useEffect(() => {
        try {
            logAmplitudePageview();
        } catch (e) {
            // ignore
        }
    }, []);
};
