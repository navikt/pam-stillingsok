import { useEffect } from "react";
import { logAmplitudePageview } from "../tracking/amplitude";

export default () => {
    useEffect(() => {
        try {
            logAmplitudePageview();
        } catch (e) {
            // ignore
        }
    }, []);
};
