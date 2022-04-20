import PropTypes from "prop-types";
import React from "react";
import "./PageHeader.less";

export default function PageHeader({ title }) {
    return (
        <header className="PageHeader">
            <h1 tabIndex={-1} className="PageHeader__title">
                {title}
            </h1>
        </header>
    );
}

PageHeader.defaultProps = {
    buttons: undefined
};

PageHeader.propTypes = {
    title: PropTypes.string.isRequired,
    buttons: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node])
};
