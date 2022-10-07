import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/Button";
import "./IconButton.less";

function IconButton({ text, icon, hideText, onClick, className, disabled, spinner, variant }) {
    return (
        <Button variant={variant} disabled={disabled} spinner={spinner} onClick={onClick} className={className}>
            <span className="IconButton__inner">
                {icon}
                {!hideText && <span>{text}</span>}
            </span>
        </Button>
    );
}

IconButton.defaultProps = {
    disabled: false,
    spinner: false,
    className: undefined,
    variant: "flat"
};

IconButton.propTypes = {
    disabled: PropTypes.bool,
    spinner: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func.isRequired,
    variant: PropTypes.string
};

export default IconButton;
