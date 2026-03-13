import { describe, it, expect } from "vitest";
import { evaluateExperimentRandom, type Rng } from "./evaluateRandom";
import type { ExperimentDefinition } from "./types";

function createSequenceRng(values: ReadonlyArray<number>): Rng {
    let index = 0;

    return () => {
        const value = values[index];
        index += 1;

        // Fallback hvis testen har for få verdier i sekvensen
        return value ?? 0;
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

describe("evaluateExperimentRandom (grensetilfeller med sekvens-rng)", () => {
    it("skal returnere standard når trafikk-gate ekskluderer brukeren", () => {
        const def = makeDef({ trafficPercent: 70 });

        const rng = createSequenceRng([
            0.7, // traffic draw
            0.99, // variant draw (skal ikke brukes fordi ikke med)
        ]);

        const result = evaluateExperimentRandom(def, rng);

        expect(result.inExperiment).toBe(false);
        expect(result.variant).toBe("standard");
    });

    it("skal inkludere brukeren når trafikk-trekning er under terskel", () => {
        const def = makeDef({ trafficPercent: 70 });

        const rng = createSequenceRng([
            0.699, // traffic draw (in)
            0.1, // variant draw (standard)
        ]);

        const result = evaluateExperimentRandom(def, rng);

        expect(result.inExperiment).toBe(true);
        expect(result.variant).toBe("standard");
    });

    it("skal velge test når variant-trekning havner i test-bøtten (50/50)", () => {
        const def = makeDef({ trafficPercent: 100 });

        const rng = createSequenceRng([
            0.0, // traffic draw (in)
            0.5, // variant draw (test)
        ]);

        const result = evaluateExperimentRandom(def, rng);

        expect(result.inExperiment).toBe(true);
        expect(result.variant).toBe("test");
    });

    it("skal respektere ujevne vekter (90/10): test kun når trekning >= 0.90", () => {
        const def = makeDef({
            trafficPercent: 100,
            variants: [
                { key: "standard", weightPercent: 90 },
                { key: "test", weightPercent: 10 },
            ],
        });

        const rngStandard = createSequenceRng([
            0.0, // traffic draw (in)
            0.89, // variant draw -> 89 < 90 => standard
        ]);

        const r1 = evaluateExperimentRandom(def, rngStandard);
        expect(r1.inExperiment).toBe(true);
        expect(r1.variant).toBe("standard");

        const rngTest = createSequenceRng([
            0.0, // traffic draw (in)
            0.9, // variant draw -> 90 < 90? false => test
        ]);

        const r2 = evaluateExperimentRandom(def, rngTest);
        expect(r2.inExperiment).toBe(true);
        expect(r2.variant).toBe("test");
    });

    it("skal alltid returnere standard når status er off, uavhengig av rng", () => {
        const def = makeDef({ status: "off" });

        const rng = createSequenceRng([0.0, 0.99]);

        const result = evaluateExperimentRandom(def, rng);

        expect(result.inExperiment).toBe(false);
        expect(result.variant).toBe("standard");
    });
});
