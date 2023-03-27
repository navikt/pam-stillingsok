import React from "react";
import "./ErrorMessage.css";
import { BodyLong, Heading } from "@navikt/ds-react";

function ErrorMessage() {
    return (
        <section className="ErrorMessage" role="alert">
            <Heading level="2" size="medium" className="mb-1 mt-1">
                Det oppsto en feil
            </Heading>
            <BodyLong className="ErrorMessage__text">Forsøk å laste inn siden på nytt</BodyLong>
        </section>
    );
}

export default ErrorMessage;
