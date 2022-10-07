import React from "react";

function HeartIcon({ariaHidden}) {
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
            aria-label="Favoritt"
        >
            <title>Favoritt</title>
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17 1c3.866 0 7 3.283 7 7.333a7.486 7.486 0 01-2.103 5.24l.103-.002L12 23 2 13.571l.103.002A7.486 7.486 0 010 8.333C0 4.283 3.134 1 7 1c1.959 0 3.73.843 5 2.202C13.27 1.843 15.042 1 17 1zm0 2c-1.26 0-2.445.498-3.359 1.385l-.179.182-1.46 1.564-1.462-1.563C9.603 3.566 8.344 3 7 3 4.26 3 2 5.368 2 8.333c0 1.383.494 2.674 1.357 3.653l.178.191 1.102 1.131L12 20.25l7.362-6.942 1.103-1.13a5.469 5.469 0 001.529-3.57L22 8.334C22 5.368 19.74 3 17 3z"
                fill="currentColor"
            />
        </svg>
    );
}

HeartIcon.propTypes = {}

export default HeartIcon;
