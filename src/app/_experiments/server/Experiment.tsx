import "server-only";

import React from "react";
import { cookies } from "next/headers";
import type { VariantKey } from "../types";
import { getExperimentCookieName, parseExperimentCookieValue } from "../cookies";
import { ExperimentKey } from "@/app/_experiments/experiments";
import { VariantSwitch } from "@/app/_experiments/VariantSwitch";

export type ExperimentProps = Readonly<{
    readonly experiment: ExperimentKey;
    readonly standard: React.ReactNode;
    readonly test: React.ReactNode;
}>;

/**
 * Server komponent som velger variant (fra cookie) og rendrer standard/test.
 * For klient komponenter, bruk `ClientExperiment` i stedet.
 */
export async function Experiment(props: ExperimentProps) {
    const cookieStore = await cookies();
    const chosen: VariantKey = (() => {
        const raw = cookieStore.get(getExperimentCookieName(props.experiment))?.value;
        const parsed = parseExperimentCookieValue(raw);

        return parsed?.variant ?? "standard";
    })();

    return <VariantSwitch variant={chosen} standard={props.standard} test={props.test} />;
}
