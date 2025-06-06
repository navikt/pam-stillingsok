import React from "react";

interface UkrainianFlagProps {
    className?: string;
    "aria-hidden"?: boolean | "true" | "false";
}

export default function UkrainianFlag({
    className = "ukraine-flag",
    "aria-hidden": ariaHidden = true,
}: UkrainianFlagProps) {
    return (
        <svg
            className={className}
            aria-hidden={ariaHidden}
            xmlns="http://www.w3.org/2000/svg"
            width="81"
            height="60"
            viewBox="0 0 81 60"
            fill="none"
        >
            <g clipPath="url(#clip0_1_2)">
                <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0H80.5V60H0.5V0Z" fill="#FFD700" />
                <path fillRule="evenodd" clipRule="evenodd" d="M0.5 0H80.5V30H0.5V0Z" fill="#0057B8" />
            </g>
            <defs>
                <clipPath id="clip0_1_2">
                    <rect x="0.5" width="80" height="60" rx="8" fill="white" />
                </clipPath>
            </defs>
        </svg>
    );
}
