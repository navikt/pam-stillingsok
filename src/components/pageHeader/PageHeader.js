import PropTypes from "prop-types";
import React from "react";
import "./PageHeader.less";
import H1WithAutoFocus from "../h1WithAutoFocus/H1WithAutoFocus";

export default function PageHeader({title, shouldAutofocus}) {
    return (
        <header className="PageHeader">
            {shouldAutofocus ? (
                <H1WithAutoFocus className="PageHeader__title">{title}</H1WithAutoFocus>
            ) : (
                <h1 className="PageHeader__title">{title}</h1>
            )}
        </header>
    );
}

PageHeader.defaultProps = {
    shouldAutofocus: false
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    shouldAutofocus: PropTypes.bool
};
