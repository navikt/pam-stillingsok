import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import "./EmptyMessage.css";
import { BodyLong, Heading, Link as AkselLink } from "@navikt/ds-react";

function EmptyMessage({ title, text }) {
    return (
        <section className="EmptyMessage">
            <Heading level="2" size="medium" spacing>
                {title}
            </Heading>
            <BodyLong className="EmptyMessage__text" spacing>
                {text}
            </BodyLong>
            <BodyLong className="EmptyMessage__text">
                <AkselLink as={Link} to={CONTEXT_PATH}>
                    Tilbake til søk
                </AkselLink>
            </BodyLong>
        </section>
    );
}

EmptyMessage.propTypes = {
    title: PropTypes.string,
    text: PropTypes.string,
};

export default EmptyMessage;
