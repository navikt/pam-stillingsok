"use client";

import type React from "react";
import { VariantSwitch } from "@/app/_experiments/VariantSwitch";
import type { VariantKey } from "../types";

export type ClientExperimentProps = Readonly<{
    readonly variant?: VariantKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

export function ClientExperiment(props: ClientExperimentProps): React.ReactElement {
    return <VariantSwitch {...props} />;
}
