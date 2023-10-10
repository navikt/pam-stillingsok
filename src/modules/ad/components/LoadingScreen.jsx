import React from "react";
import "./LoadingScreen.css";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";

function LoadingScreen() {
    return (
        <div className="AdLoadingScreen">
            <DelayedSpinner />
        </div>
    );
}

export default LoadingScreen;
