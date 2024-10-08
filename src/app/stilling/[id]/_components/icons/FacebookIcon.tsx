import * as React from "react";
import { ReactElement } from "react";

function FacebookIcon(): ReactElement {
    return (
        <svg
            role="img"
            aria-label="Del på Facebook"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7574 2.75736C11.8826 1.63214 13.4087 1 15 1H18C18.5523 1 19 1.44772 19 2V6C19 6.55228 18.5523 7 18 7H15V9H18C18.3079 9 18.5987 9.14187 18.7882 9.38459C18.9777 9.6273 19.0448 9.94379 18.9701 10.2425L17.9701 14.2425C17.8589 14.6877 17.4589 15 17 15H15V22C15 22.5523 14.5523 23 14 23H10C9.44772 23 9 22.5523 9 22V15H7C6.44772 15 6 14.5523 6 14V10C6 9.44772 6.44772 9 7 9H9V7C9 5.4087 9.63214 3.88258 10.7574 2.75736ZM15 3C13.9391 3 12.9217 3.42143 12.1716 4.17157C11.4214 4.92172 11 5.93913 11 7V10C11 10.5523 10.5523 11 10 11H8V13H10C10.5523 13 11 13.4477 11 14V21H13V14C13 13.4477 13.4477 13 14 13H16.2192L16.7192 11H14C13.4477 11 13 10.5523 13 10V7C13 6.46957 13.2107 5.96086 13.5858 5.58579C13.9609 5.21071 14.4696 5 15 5H17V3H15Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default FacebookIcon;
