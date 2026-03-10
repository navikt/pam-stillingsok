import type { ExperimentDefinition, VariantKey } from "./types";

function fnv1a32(input: string): number {
    let hash = 0x811c9dc5;
    for (let index = 0; index < input.length; index += 1) {
        hash ^= input.charCodeAt(index);
        hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
    }
    return hash >>> 0;
}

function bucket0to99(seed: string): number {
    return fnv1a32(seed) % 100;
}

function pickWeightedVariant(def: ExperimentDefinition, variantBucket: number): VariantKey {
    let cumulative = 0;
    for (const variant of def.variants) {
        cumulative += variant.weightPercent;
        if (variantBucket < cumulative) {
            return variant.key;
        }
    }
    return def.variants[0]?.key ?? "control";
}

export type EvaluationResult = Readonly<{
    readonly inExperiment: boolean;
    readonly variant: VariantKey;
}>;

export function evaluateExperiment(def: ExperimentDefinition, userId: string): EvaluationResult {
    if (def.status !== "on") {
        return { inExperiment: false, variant: "standard" };
    }

    const trafficBucket = bucket0to99(`${def.key}:${userId}:traffic`);
    if (trafficBucket >= def.trafficPercent) {
        return { inExperiment: false, variant: "test" };
    }

    const variantBucket = bucket0to99(`${def.key}:${userId}:variant`);
    const variant = pickWeightedVariant(def, variantBucket);

    return { inExperiment: true, variant };
}
