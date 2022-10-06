import React from "react";
import Spinner from "../../../components/Spinner/Spinner";
import "./LoadingScreen.less";

function LoadingScreen() {
    return (
        <div className="LoadingScreen">
            <Spinner />
        </div>
    );
}

LoadingScreen.propTypes = {};

export default LoadingScreen;
