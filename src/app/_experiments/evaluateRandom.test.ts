import { describe, it, expect } from "vitest";
import { evaluateExperimentRandom, Rng } from "./evaluateRandom";
import type { ExperimentDefinition } from "./types";

export function createSeededRng(seedStart: number): Rng {
    let seed = seedStart;

    return () => {
        const modulus = 2 ** 31;
        const multiplier = 1103515245;
        const increment = 12345;

        seed = (multiplier * seed + increment) % modulus;
        return seed / modulus;
    };
}

function makeDef(overrides: Partial<ExperimentDefinition>): ExperimentDefinition {
    return {
        key: "search_jobs_cta",
        status: "on",
        trafficPercent: 70,
        pathPrefixes: ["/"],
        variants: [
            { key: "standard", weightPercent: 50 },
            { key: "test", weightPercent: 50 },
        ],
        ...overrides,
    };
}

describe("evaluateExperimentRandom", () => {
    it("skal alltid returnere standard når status er off", () => {
        const def = makeDef({ status: "off" });
        const rng = createSeededRng(123);

        // Kjør et par ganger for å være sikker på at random ikke påvirker
        for (let index = 0; index < 100; index += 1) {
            const result = evaluateExperimentRandom(def, rng);
            expect(result.inExperiment).toBe(false);
            expect(result.variant).toBe("standard");
        }
    });

    it("skal plassere omtrent trafficPercent av nye tildelinger i eksperimentet", () => {
        const def = makeDef({ trafficPercent: 70 });
        const rng = createSeededRng(123456789);

        const iterations = 5_000;
        let inExperimentCount = 0;

        for (let index = 0; index < iterations; index += 1) {
            const result = evaluateExperimentRandom(def, rng);
            if (result.inExperiment) {
                inExperimentCount += 1;
            }
        }

        const ratio = inExperimentCount / iterations;

        // Forventer ca 0.70. pluss/minus 0.02
        expect(ratio).toBeGreaterThanOrEqual(0.68);
        expect(ratio).toBeLessThanOrEqual(0.72);
    });

    it("skal velge varianter omtrent i henhold til vekter når alle er i eksperimentet", () => {
        const def = makeDef({
            trafficPercent: 100,
            variants: [
                { key: "standard", weightPercent: 50 },
                { key: "test", weightPercent: 50 },
            ],
        });
        const rng = createSeededRng(42);
        const iterations = 5_000;
        let standardCount = 0;
        let testCount = 0;

        for (let index = 0; index < iterations; index += 1) {
            const result = evaluateExperimentRandom(def, rng);

            if (result.variant === "standard") {
                standardCount += 1;
            } else {
                testCount += 1;
            }
        }

        const standardRatio = standardCount / iterations;
        const testRatio = testCount / iterations;

        // forventer ca 50/50. pluss/minus 0.02
        expect(standardRatio).toBeGreaterThanOrEqual(0.48);
        expect(standardRatio).toBeLessThanOrEqual(0.52);

        expect(testRatio).toBeGreaterThanOrEqual(0.48);
        expect(testRatio).toBeLessThanOrEqual(0.52);
    });

    it("skal respektere ujevne vekter (eksempel 90/10)", () => {
        const def = makeDef({
            trafficPercent: 100,
            variants: [
                { key: "standard", weightPercent: 90 },
                { key: "test", weightPercent: 10 },
            ],
        });

        const rng = createSeededRng(99);
        const iterations = 5_000;
        let testCount = 0;

        for (let index = 0; index < iterations; index += 1) {
            const result = evaluateExperimentRandom(def, rng);
            if (result.variant === "test") {
                testCount += 1;
            }
        }

        const testRatio = testCount / iterations;

        // forventer ca 0.10. pluss/minus 0.015
        expect(testRatio).toBeGreaterThanOrEqual(0.085);
        expect(testRatio).toBeLessThanOrEqual(0.115);
    });
});
