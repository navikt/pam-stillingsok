import React from "react";

function ArrowUpIcon({ariaHidden}) {
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
                d="M13 24V3.705L20.546 11 22 9.625 12 0 2 9.625 3.455 11 11 3.705V24h2z"
                fill="currentColor"
            />
        </svg>
    );
}

export default ArrowUpIcon;
