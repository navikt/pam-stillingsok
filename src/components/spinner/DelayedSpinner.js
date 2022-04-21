import React, {useEffect, useState} from "react";
import Spinner from "nav-frontend-spinner";
import "./DelayedSpinner.less";

/**
 * While doing fetch calls on a fast network, a spinner will normally be
 * visible just for a few milliseconds. To reduce visual noise, it can
 * be delayed, and appear only for slower fetch calls.
 * @param delay - default 1000ms
 */
export default function DelayedSpinner(delay = 1000) {
    const [showSpinner, setShowSpinner] = useState(false);

    useEffect(() => {
        const spinnerTimeout = setTimeout(() => {
            setShowSpinner(true);
        }, delay);

        return () => {
            clearTimeout(spinnerTimeout);
        };
    }, []);

    return <div className="DelayedSpinner">{showSpinner && <Spinner type="XL"/>}</div>;
}
