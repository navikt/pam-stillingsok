import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import ChevronLeftIcon from "../icons/ChevronLeftIcon";
import "./BackLink.less";

function BackLink({ to, text }) {
    return (
        <Link to={to} className="BackLink link">
            <ChevronLeftIcon ariaHidden={true} />
            {text}
        </Link>
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
