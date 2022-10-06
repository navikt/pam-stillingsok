import React, { useEffect, useState } from "react";
import "./Spinner.css";

/**
 * While doing fetch calls on a fast network, a spinner will normally be
 * visible just for a few milliseconds. To reduce visual noise, it can
 * be delayed, and appear only for slower fetch calls.
 */
export default function Spinner() {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const spinnerTimeout = setTimeout(() => {
            setShowSpinner(true);
        }, 1000);

        return () => {
            clearTimeout(spinnerTimeout);
        };
    }, []);

    return (
        <div className="Spinner" role="status" aria-label="Laster">
            {showSpinner && <div className="Spinner__circle" />}
        </div>
    );
}
