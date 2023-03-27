import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { Link as AkselLink } from "@navikt/ds-react";

function BackLink({ to, text }) {
    return (
        <AkselLink as={Link} to={to}>
            <ChevronLeftIcon aria-hidden="true" width="1.5em" height="1.5em" />
            {text}
        </AkselLink>
    );
}

BackLink.defaultProps = {
    text: "Tilbake"
};

BackLink.propsTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string
};

export default BackLink;
