"use client";

import React from "react";
import config from "@/app/stillinger/_common/config/axe-config";

export default function Axe(): JSX.Element | null {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
        Promise.all([import("@axe-core/react"), import("react-dom")]).then(([axe, ReactDOM]) =>
            axe.default(React, ReactDOM, 1000, config),
        );
    }
    return null;
}
