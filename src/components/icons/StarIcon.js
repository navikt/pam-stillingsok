import React from "react";
import PropTypes from "prop-types";

function Star({ size }) {
    return (
        <svg
            width={size ? size : "1em"}
            height={size ? size : "1em"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0l3.708 7.571L24 8.785l-6 5.893L19.416 23 12 19.071 4.584 23 6 14.678 0 8.785l8.292-1.214L12 0zm2.312 9.508L12 4.788l-2.312 4.72-5.17.757 3.742 3.674-.884 5.186L12 16.677l4.623 2.448-.883-5.186 3.74-3.675-5.168-.756z"
                fill="currentColor"
            />
        </svg>
    );
}

function StarFilled({ size }) {
    return (
        <svg
            width={size ? size : "1em"}
            height={size ? size : "1em"}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            focusable="false"
            role="img"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M12 0l3.708 7.571L24 8.785l-6 5.893L19.416 23 12 19.071 4.584 23 6 14.678 0 8.785l8.292-1.214L12 0z"
                fill="currentColor"
            />
        </svg>
    );
}

function StarIcon({ filled, size }) {
    if (filled) {
        return <StarFilled size={size} />;
    } else {
        return <Star size={size} />;
    }
}

StarIcon.defaultProps = {
    filled: false
};

StarIcon.propTypes = {
    filled: PropTypes.bool
};

export default StarIcon;
