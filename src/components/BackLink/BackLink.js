import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import "./BackLink.less";

function BackLink({ to, text }) {
    return (
        <Link to={to} className="BackLink link">
            <svg
                width="1em"
                height="1em"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                focusable="false"
                role="img"
                aria-hidden="true"
            >
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M7 12l8.571-9L17 4.5 9.857 12 17 19.5 15.571 21 7 12z"
                    fill="currentColor"
                />
            </svg>
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
