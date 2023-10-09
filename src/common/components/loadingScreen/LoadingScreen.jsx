import React from "react";
import DelayedSpinner from "../spinner/DelayedSpinner";
import "./LoadingScreen.css";

function LoadingScreen() {
    return (
        <div className="LoadingScreen">
            <DelayedSpinner />
        </div>
    );
}

export default LoadingScreen;
