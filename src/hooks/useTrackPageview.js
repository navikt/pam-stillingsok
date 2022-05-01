import { useEffect } from "react";
import { logAmplitudePageview } from "../tracking/amplitude";

export default (page) => {
    useEffect(() => {
        try {
            logAmplitudePageview();
        } catch (e) {
            // ignore
        }
    }, []);
};
