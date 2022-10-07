import React from "react";
import PropTypes from "prop-types";
import "./Tag.css";

function Tag({ children, className }) {
    return <div className={className ? `Tag ${className}` : "Tag"}>{children}</div>;
}

Tag.defaultProps = {
    className: undefined
};

Tag.propTypes = {
    className: PropTypes.string,
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired
};

export default Tag;
