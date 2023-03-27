import React from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import "./EmptyMessage.css";
import { BodyLong, Heading } from "@navikt/ds-react";

function EmptyMessage({ title, text }) {
    return (
        <section className="EmptyMessage">
            <Heading level="2" size="medium">
                {title}
            </Heading>
            <BodyLong className="EmptyMessage__text" spacing>
                {text}
            </BodyLong>
            <BodyLong className="EmptyMessage__text">
                <Link to={CONTEXT_PATH}>Tilbake til søk</Link>
            </BodyLong>
        </section>
    );
}

export default EmptyMessage;
