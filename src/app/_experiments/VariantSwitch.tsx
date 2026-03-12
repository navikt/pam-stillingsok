import React from "react";
import type { VariantKey } from "./types";

export type VariantSwitchProps = Readonly<{
    readonly variant?: VariantKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

export function VariantSwitch(props: VariantSwitchProps): React.ReactElement {
    const chosen: VariantKey = props.variant ?? "standard";

    if (chosen === "test") {
        return <>{props.test}</>;
    }

    return <>{props.standard}</>;
}
