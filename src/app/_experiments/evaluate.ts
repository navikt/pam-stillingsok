import type { ExperimentDefinition, VariantKey } from "./types";

/**
 * FNV-1a 32-bit hash: rask og stabil hashing for bucketing.
 * Ikke kryptografisk – kun for jevn fordeling.
 */
function fnv1a32(input: string): number {
    let hash = 0x811c9dc5;

    for (let index = 0; index < input.length; index += 1) {
        // Bland inn tegnet
        hash ^= input.charCodeAt(index);

        // Multipliser med FNV-prime (16777619) via bit-shifts + addisjon i 32-bit.
        // >>> 0 tvinger unsigned 32-bit (JS ellers bruker 64-bit float).
        hash = (hash + (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24)) >>> 0;
    }

    return hash >>> 0;
}

/**
 * Mapper seed -> bucket i 0..99.
 * Brukes til prosent-basert fordeling (traffic/weights).
 */
function bucket0to99(seed: string): number {
    return fnv1a32(seed) % 100;
}

/**
 * Velger variant basert på vekting.
 * Eksempel:
 *  - standard 50, test 50: bucket 0..49 => standard, 50..99 => test
 */
function pickWeightedVariant(def: ExperimentDefinition, variantBucket: number): VariantKey {
    let cumulative = 0;

    for (const variant of def.variants) {
        cumulative += variant.weightPercent;

        if (variantBucket < cumulative) {
            return variant.key;
        }
    }

    // Fallback hvis config er feil (vekter summerer ikke til 100 eller array er tom).
    // Baseline bør være standard.
    return def.variants[0]?.key ?? "standard";
}

export type EvaluationResult = Readonly<{
    readonly inExperiment: boolean;
    readonly variant: VariantKey;
}>;

/**
 * Bestemmer:
 *  Om brukeren er med i eksperimentet (trafficPercent)
 *  Hvilken variant brukeren får (weighted)
 *
 *  samme userId + experiment.
 */
export function evaluateExperiment(def: ExperimentDefinition, userId: string): EvaluationResult {
    // Eksperimentet er av => alle får baseline
    if (def.status !== "on") {
        return { inExperiment: false, variant: "standard" };
    }

    // Traffic gating: avgjør om brukeren er med
    const trafficBucket = bucket0to99(`${def.key}:${userId}:traffic`);
    if (trafficBucket >= def.trafficPercent) {
        // Ikke med => baseline (standard)
        return { inExperiment: false, variant: "standard" };
    }

    // Med i eksperimentet => velg variant uavhengig av trafficBucket
    const variantBucket = bucket0to99(`${def.key}:${userId}:variant`);
    const variant = pickWeightedVariant(def, variantBucket);

    return { inExperiment: true, variant };
}
