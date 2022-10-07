import React from "react";
import DelayedSpinner from "../../../components/DelayedSpinner/DelayedSpinner";
import "./LoadingScreen.css";

function LoadingScreen() {
    return (
        <div className="LoadingScreen">
            <DelayedSpinner />
        </div>
    );
}

LoadingScreen.propTypes = {};

export default LoadingScreen;
