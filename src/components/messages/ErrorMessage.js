import React from "react";
import "./ErrorMessage.less";

function ErrorMessage() {
    return (
        <section className="ErrorMessage">
            <h2 className="ErrorMessage__h2">Det oppsto en feil</h2>
            <p className="ErrorMessage__text">Forsøk å laste inn siden på nytt</p>
        </section>
    );
}

export default ErrorMessage;
