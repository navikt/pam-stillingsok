import React from "react";
import PropTypes from "prop-types";

function ChevronCollapseIcon({ ariaHidden }) {
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
                d="M12 7l-9 8.571L4.5 17 12 9.857 19.5 17l1.5-1.429L12 7z"
                fill="currentColor"
            />
        </svg>
    );
}

ChevronCollapseIcon.defaultProps = {
    ariaHidden: undefined
}

ChevronCollapseIcon.propTypes = {
    ariaHidden: PropTypes.bool
};

export default ChevronCollapseIcon;
