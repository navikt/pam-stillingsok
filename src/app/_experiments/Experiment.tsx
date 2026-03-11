import React from "react";
import { cookies } from "next/headers";
import type { ExperimentKey, VariantKey } from "./types";
import { getExperimentCookieName, parseExperimentCookieValue } from "./cookies";

export type ExperimentProps = Readonly<{
    readonly experiment: ExperimentKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

/**
 * Server komponent som rendrer forskjellig innhold basert på tildelt variant for et gitt eksperiment.
 * For klient komponenter, bruk `ClientExperiment` i stedet.
 */
export async function Experiment(props: ExperimentProps) {
    const cookieStore = await cookies();
    const raw = cookieStore.get(getExperimentCookieName(props.experiment))?.value;
    const parsed = parseExperimentCookieValue(raw);

    const chosen: VariantKey = parsed?.variant ?? "standard";

    if (chosen === "test") {
        return <>{props.test}</>;
    }

    return <>{props.standard}</>;
}
