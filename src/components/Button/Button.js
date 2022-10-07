import React from "react";
import PropTypes from "prop-types";
import "./Button.less";

function Button({ variant, onClick, id, children, disabled, spinner, htmlType, className }) {
    return (
        <button
            id={id}
            type={htmlType}
            className={`Button Button--${variant}${className ? " " + className : ""}`}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
            {spinner && <span className="Button__spinner" aria-label="Laster" />}
        </button>
    );
}

Button.defaultProps = {
    variant: "secondary",
    htmlType: undefined,
    spinner: false,
    disabled: false,
    className: undefined,
    id: undefined
};

Button.propTypes = {
    variant: PropTypes.oneOf(["primary", "secondary", "flat"]),
    onClick: PropTypes.func.isRequired,
    htmlType: PropTypes.oneOf(["submit", "button"]),
    disabled: PropTypes.bool,
    spinner: PropTypes.bool,
    className: PropTypes.string,
    id: PropTypes.string
};

export default Button;
