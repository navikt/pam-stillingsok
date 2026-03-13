import React from "react";
import type { VariantKey } from "./types";

export type VariantSwitchProps = Readonly<{
    readonly variant?: VariantKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

/**
 * Laget denne da retur er lik for server og klient versjonen.
 * dersom man må endre noe på det så er det bare en plass å gjøre det
 */
export function VariantSwitch(props: VariantSwitchProps): React.ReactElement {
    const chosen: VariantKey = props.variant ?? "standard";

    if (chosen === "test") {
        return <>{props.test}</>;
    }

    return <>{props.standard}</>;
}
