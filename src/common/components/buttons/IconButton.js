import React from "react";
import PropTypes from "prop-types";
import { Knapp } from "@navikt/arbeidsplassen-knapper";
import "./IconButton.less";

function IconButton({ text, icon, hideText, onClick, className, disabled, spinner, type }) {
    return (
        <Knapp type={type} disabled={disabled} spinner={spinner} onClick={onClick} className={className}>
            <span className="IconButton__inner">
                {icon}
                {!hideText && <span>{text}</span>}
            </span>
        </Knapp>
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
