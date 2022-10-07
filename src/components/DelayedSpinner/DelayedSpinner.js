import React, { useEffect, useState } from "react";
import "./DelayedSpinner.css";
import { Loader } from "@navikt/ds-react";

/**
 * While doing fetch calls on a fast network, a spinner will normally be
 * visible just for a few milliseconds. To reduce visual noise, it can
 * be delayed, and appear only for slower fetch calls.
 */
export default function DelayedSpinner() {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const spinnerTimeout = setTimeout(() => {
            setShowSpinner(true);
        }, 1000);

        return () => {
            clearTimeout(spinnerTimeout);
        };
    }, []);

    if (showSpinner) {
        return (
            <div className="DelayedSpinner">
                <Loader size="2xlarge" title="Venter" />;
            </div>
        );
    } else {
        return null;
    }
}
