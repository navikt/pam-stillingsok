import React, { useEffect, useState } from "react";
import { Loader } from "@navikt/ds-react";
import "./DelayedSpinner.css";

/**
 * While doing fetch calls on a fast network, a spinner will normally be
 * visible just for a few milliseconds. To reduce visual noise, it can
 * be delayed, and appear only for slower fetch calls.
 */
export default function DelayedSpinner({ delay = 1000 }) {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const spinnerTimeout = setTimeout(() => {
            setShowSpinner(true);
        }, delay);

        return () => {
            clearTimeout(spinnerTimeout);
        };
    }, []);

    return (
        <div className="DelayedSpinner" role="status">
            {showSpinner && <Loader size="2xlarge" />}
        </div>
    );
}
