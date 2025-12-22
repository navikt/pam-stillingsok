import * as React from "react";
import styles from "./UngOgVilJobbePromo.module.css";

type Props = Omit<React.SVGProps<SVGSVGElement>, "children">;

export default function FigureLookingRight(props: Props) {
    return (
        <svg
            width="220"
            height="101"
            viewBox="0 0 220 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            focusable="false"
            {...props}
        >
            <path
                d="M219.849 83.7663C219.849 129.673 170.766 166.887 110.218 166.887C49.6706 166.887 -6.37377 137.201 0.587068 83.7663C7.54791 30.3319 47.5718 -5.29241 110.218 0.645108C172.865 6.58263 219.849 37.8597 219.849 83.7663Z"
                fill="url(#paint0_linear_10494_31616)"
            />

            <g clipPath="url(#clip0_10494_31616)">
                <ellipse cx="82.1533" cy="65.8171" rx="15.4346" ry="23.5358" fill="white" />
                <ellipse
                    cx="87.6183"
                    cy="60.2311"
                    rx="8.17127"
                    ry="14.4836"
                    fill="#024B62"
                    className={styles["pupil"]}
                />

                <ellipse cx="134.813" cy="65.8172" rx="15.4346" ry="23.5358" fill="white" />
                <ellipse
                    cx="140.161"
                    cy="60.2311"
                    rx="8.17127"
                    ry="14.4836"
                    fill="#024B62"
                    className={styles["pupil"]}
                />
            </g>

            <defs>
                <linearGradient
                    id="paint0_linear_10494_31616"
                    x1="109.925"
                    y1="0"
                    x2="109.925"
                    y2="166.887"
                    gradientUnits="userSpaceOnUse"
                >
                    <stop offset="0" stopColor="#FDB580" />
                    <stop offset="1" stopColor="#EFA773" />
                </linearGradient>

                <clipPath id="clip0_10494_31616">
                    <rect width="83.5285" height="47.0717" fill="white" transform="translate(66.7187 42.2812)" />
                </clipPath>
            </defs>
        </svg>
    );
}
