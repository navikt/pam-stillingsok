import React from "react";
import DelayedSpinner from "../../../components/spinner/DelayedSpinner";
import "./LoadingScreen.less";

function LoadingScreen() {
    return (
        <div className="LoadingScreen">
            <DelayedSpinner />
        </div>
    );
}

LoadingScreen.propTypes = {}

export default LoadingScreen;
