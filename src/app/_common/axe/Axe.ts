"use client";

import React, { type JSX, useEffect, useRef } from "react";
import config from "@/app/_common/axe/axe-config";

export default function Axe(): JSX.Element | null {
    const hasRunRef = useRef(false);

    useEffect(() => {
        if (typeof window === "undefined" || process.env.NODE_ENV === "production" || hasRunRef.current) {
            return;
        }

        hasRunRef.current = true;

        const runAxe = () => {
            void Promise.all([import("@axe-core/react"), import("react-dom")]).then(([axe, ReactDOM]) => {
                axe.default(React, ReactDOM, 1000, config);
            });
        };

        if (document.readyState === "complete") {
            window.setTimeout(runAxe, 250);
            return;
        }

        window.addEventListener(
            "load",
            () => {
                window.setTimeout(runAxe, 250);
            },
            { once: true },
        );
    }, []);

    return null;
}
