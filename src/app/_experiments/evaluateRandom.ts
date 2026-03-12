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

export function evaluateExperimentRandom(def: ExperimentDefinition): EvaluationResult {
    if (def.status !== "on") {
        return { inExperiment: false, variant: "standard" };
    }

    const inExperiment = Math.random() * 100 < def.trafficPercent;
    if (!inExperiment) {
        return { inExperiment: false, variant: "standard" };
    }

    const variant = pickWeightedVariant(def, Math.random());
    return { inExperiment: true, variant };
}
