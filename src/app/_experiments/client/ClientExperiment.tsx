"use client";

import React from "react";
import type { VariantKey } from "../types";
import { VariantSwitch } from "@/app/_experiments/VariantSwitch";

export type ClientExperimentProps = Readonly<{
    readonly variant?: VariantKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

export function ClientExperiment(props: ClientExperimentProps): React.ReactElement {
    return <VariantSwitch {...props} />;
}
