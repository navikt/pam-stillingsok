import { useEffect } from "react";
import { logAmplitudePageview } from "../api/amplitude/amplitude";

export default (page) => {
    useEffect(() => {
        try {
            logAmplitudePageview();
        } catch (e) {
            // ignore
        }
    }, []);
};
