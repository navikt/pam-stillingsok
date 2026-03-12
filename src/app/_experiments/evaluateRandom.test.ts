import { describe, it, expect } from "vitest";
import { evaluateExperimentRandom } from "./evaluateRandom";
import type { ExperimentDefinition } from "./types";

// Hjelpefunksjon for å lage en standard definisjon som kan overstyres i testene
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

        // Kjør et par ganger for å være sikker på at random ikke påvirker
        for (let index = 0; index < 100; index += 1) {
            const result = evaluateExperimentRandom(def);
            expect(result.inExperiment).toBe(false);
            expect(result.variant).toBe("standard");
        }
    });

    it("skal plassere omtrent trafficPercent av nye tildelinger i eksperimentet", () => {
        const def = makeDef({ trafficPercent: 70 });

        const iterations = 30_000;
        let inExperimentCount = 0;

        for (let index = 0; index < iterations; index += 1) {
            const result = evaluateExperimentRandom(def);
            if (result.inExperiment) {
                inExperimentCount += 1;
            }
        }

        const ratio = inExperimentCount / iterations;

        // Forvent ~0.70. Toleranse ±0.02 (2 prosentpoeng)
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

        const iterations = 30_000;
        let standardCount = 0;
        let testCount = 0;

        for (let index = 0; index < iterations; index += 1) {
            const result = evaluateExperimentRandom(def);

            if (result.variant === "standard") {
                standardCount += 1;
            } else {
                testCount += 1;
            }
        }

        const standardRatio = standardCount / iterations;
        const testRatio = testCount / iterations;

        // Forvent ~50/50. Toleranse ±0.02
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

        const iterations = 30_000;
        let testCount = 0;

        for (let index = 0; index < iterations; index += 1) {
            const result = evaluateExperimentRandom(def);
            if (result.variant === "test") {
                testCount += 1;
            }
        }

        const testRatio = testCount / iterations;

        // Forvent ~0.10. Toleranse ±0.015
        expect(testRatio).toBeGreaterThanOrEqual(0.085);
        expect(testRatio).toBeLessThanOrEqual(0.115);
    });
});
