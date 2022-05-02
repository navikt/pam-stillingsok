import React from "react";
import PropTypes from "prop-types";

function ChevronExpandIcon({ ariaHidden }) {
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
                d="M12 17L3 8.429 4.5 7l7.5 7.143L19.5 7 21 8.429 12 17z"
                fill="currentColor"
            />
        </svg>
    );
}

ChevronExpandIcon.defaultProps = {
    ariaHidden: undefined
}

ChevronExpandIcon.propTypes = {
    ariaHidden: PropTypes.bool
};

export default ChevronExpandIcon;
