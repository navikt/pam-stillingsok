import * as React from "react";
import { ReactElement } from "react";

function TwitterIcon(): ReactElement {
    return (
        <svg
            role="img"
            aria-label="Del på Twitter"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M18.6204 3.20461C18.7346 3.07456 18.8992 3 19.0722 3C19.5892 3 19.8652 3.60931 19.5241 3.99786L13.7239 10.6056L19.8986 19.4265C20.3625 20.0893 19.8884 21 19.0793 21H16.1207C15.7943 21 15.4886 20.8408 15.3014 20.5735L10.7197 14.0282L4.7796 20.7954C4.66544 20.9254 4.50079 21 4.32775 21C3.81075 21 3.53484 20.3907 3.87589 20.0021L10.0099 13.0141L4.10142 4.57346C3.63748 3.91069 4.11163 3 4.92066 3H7.87934C8.20566 3 8.51145 3.15921 8.69858 3.42654L13.0141 9.59155L18.6204 3.20461ZM16.2248 19.8L5.30479 4.2H7.77521L18.6952 19.8H16.2248Z"
                fill="currentColor"
            />
        </svg>
    );
}

export default TwitterIcon;
