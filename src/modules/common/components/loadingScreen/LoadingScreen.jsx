import React from "react";
import DelayedSpinner from "../spinner/DelayedSpinner";

function LoadingScreen() {
    return (
        <div className="full-width height-100vh">
            <DelayedSpinner />
        </div>
    );
}

export default LoadingScreen;
