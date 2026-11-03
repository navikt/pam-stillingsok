import "server-only";

import type { ReactNode } from "react";
import type { ExperimentKey } from "../config";
import { getExperimentVariant } from "./experiments";

type ExperimentProps = Readonly<{
    experiment: ExperimentKey;
    standard: ReactNode;
    test: ReactNode;
}>;

/** Server Component. Rendrer `test` eller `standard`. Send `null` for å vise ingenting i en variant. */
export async function Experiment({ experiment, standard, test }: ExperimentProps): Promise<ReactNode> {
    const variant = await getExperimentVariant(experiment);
    return variant === "test" ? test : standard;
}
