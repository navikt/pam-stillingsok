"use client";

import React from "react";
import type { VariantKey } from "./types";

export type ClientExperimentProps = Readonly<{
    readonly variant?: VariantKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

export function ClientExperiment(props: ClientExperimentProps): React.ReactElement {
    if (props.variant === "test") {
        return <>{props.test}</>;
    }

    return <>{props.standard}</>;
}
