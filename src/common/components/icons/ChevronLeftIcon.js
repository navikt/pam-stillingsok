import React from "react";
import PropTypes from "prop-types";

function ChevronLeftIcon({ ariaHidden }) {
    return (
        <svg
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
            aria-hidden={ariaHidden}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M7 12l8.571-9L17 4.5 9.857 12 17 19.5 15.571 21 7 12z"
                fill="currentColor"
            />
        </svg>
    );
}

ChevronLeftIcon.defaultProps = {
    ariaHidden: undefined
};

ChevronLeftIcon.propTypes = {
    ariaHidden: PropTypes.bool
};

export default ChevronLeftIcon;
