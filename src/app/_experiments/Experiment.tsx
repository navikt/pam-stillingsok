import React from "react";
import { cookies } from "next/headers";
import type { ExperimentKey, VariantKey } from "./types";
import { getExperimentCookieName, parseExperimentCookieValue } from "./cookies";

export type ExperimentProps = Readonly<{
    readonly experiment: ExperimentKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

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
