import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { Link as AkselLink } from "@navikt/ds-react";

function BackLink({ to, text, className }) {
    return (
        <AkselLink as={Link} to={to} className={className}>
            <ChevronLeftIcon aria-hidden="true" width="1.5em" height="1.5em" />
            {text}
        </AkselLink>
    );
}

BackLink.defaultProps = {
    text: "Tilbake",
    className: undefined
};

BackLink.propsTypes = {
    to: PropTypes.string.isRequired,
    text: PropTypes.string,
    className: PropTypes.string
};

export default BackLink;
