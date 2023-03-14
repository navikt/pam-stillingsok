import React from "react";
import PropTypes from "prop-types";
import { Button } from "@navikt/ds-react";
import "./IconButton.css";

function IconButton({ text, icon, hideText, onClick, className, disabled, spinner, type }) {
    let variant = "tertiary"
    if (type === "knapp")
        variant = "secondary"
    else if (type === "flat")
        variant = "tertiary"
    return (
        <Button variant={variant} disabled={disabled} loading={spinner} onClick={onClick} className={className} icon={icon}>
            {!hideText && <span>{text}</span>}
        </Button>
    );
}

IconButton.defaultProps = {
    disabled: false,
    spinner: false,
    className: undefined,
    type: "flat"
};

IconButton.propTypes = {
    disabled: PropTypes.bool,
    spinner: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    type: PropTypes.string
};

export default IconButton;
