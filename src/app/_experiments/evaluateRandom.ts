import type { ExperimentDefinition, VariantKey } from "./types";

export type EvaluationResult = Readonly<{
    readonly inExperiment: boolean;
    readonly variant: VariantKey;
}>;

function pickWeightedVariant(def: ExperimentDefinition, random0to1: number): VariantKey {
    const value = random0to1 * 100;

    let cumulative = 0;
    for (const v of def.variants) {
        cumulative += v.weightPercent;
        if (value < cumulative) {
            return v.key;
        }
    }

    return def.variants[0]?.key ?? "standard";
}
export type Rng = () => number; // 0 <= n < 1

export function evaluateExperimentRandom(def: ExperimentDefinition, rng: Rng = Math.random): EvaluationResult {
    if (def.status !== "on") {
        return { inExperiment: false, variant: "standard" };
    }

    const inExperiment = rng() * 100 < def.trafficPercent;
    if (!inExperiment) {
        return { inExperiment: false, variant: "standard" };
    }

    const variant = pickWeightedVariant(def, rng());
    return { inExperiment: true, variant };
}
