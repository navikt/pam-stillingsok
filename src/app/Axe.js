"use client";

import React from "react";
import config from "@/app/_common/config/axe-config";

function Axe() {
    if (typeof window !== "undefined" && process.env.NODE_ENV !== "production") {
        Promise.all([import("@axe-core/react"), import("react-dom")]).then(([axe, ReactDOM]) =>
            axe.default(React, ReactDOM, 1000, config),
        );
    }
    return null;
}

export default Axe;
