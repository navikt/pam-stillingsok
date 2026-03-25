"use client";

import React, { createContext, useContext } from "react";
import type { VariantKey } from "../types";
import type { VariantMap } from "../server/getVariantMap";
import { ExperimentKey } from "@/app/_experiments/experiments";

type ExperimentContextValue = Readonly<{ readonly variants: VariantMap }>;
const ExperimentContext = createContext<ExperimentContextValue | null>(null);

export type ExperimentProviderProps = Readonly<{
    readonly variants: VariantMap;
    readonly children: React.ReactNode;
}>;

export function ExperimentProvider(props: ExperimentProviderProps): React.ReactElement {
    return (
        <ExperimentContext.Provider value={{ variants: props.variants }}>{props.children}</ExperimentContext.Provider>
    );
}

export function useExperimentVariant(key: ExperimentKey): VariantKey {
    const ctx = useContext(ExperimentContext);
    if (!ctx) {
        return "standard";
    }
    return ctx.variants[key] ?? "standard";
}
