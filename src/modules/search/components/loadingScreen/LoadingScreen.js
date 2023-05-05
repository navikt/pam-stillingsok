import React from "react";
import DelayedSpinner from "../../../../common/components/spinner/DelayedSpinner";
import "./LoadingScreen.css";

function LoadingScreen() {
    return (
        <div className="LoadingScreen">
            <DelayedSpinner delay={500} />
        </div>
    );
}

LoadingScreen.propTypes = {};

export default LoadingScreen;
