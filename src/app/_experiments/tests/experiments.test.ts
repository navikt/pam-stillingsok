import { describe, expect, it } from "vitest";
import {
    buildHashInput,
    computeVariant,
    type ExperimentDefinition,
    type ExperimentVariant,
    evaluateExperiment,
} from "../core/experiments";

const NOW = new Date("2026-06-01T12:00:00Z");
const ZERO_ID = "0".repeat(32);

function makeDefinition(overrides: Partial<ExperimentDefinition> = {}): ExperimentDefinition {
    return {
        key: "ny-cta",
        status: "on",
        assignmentVersion: 1,
        owner: "team-arbeidsplassen",
        endsAt: "2026-12-31T23:59:59Z",
        eligiblePathPrefixes: ["/"],
        ...overrides,
    };
}

describe("computeVariant", () => {
    // Forventet variant er krysssjekket mot `printf '%s' '<hash-input>' | shasum -a 256`.
    // Første byte >= 0x80 gir `test`.
    it.each<[string, string, number, ExperimentVariant]>([
        [ZERO_ID, "ny-cta", 1, "standard"], // 7f
        [ZERO_ID, "ny-cta", 2, "test"], // d2: versjon påvirker utfallet
        [ZERO_ID, "annen-test", 1, "test"], // a7: nøkkel påvirker utfallet
        ["0123456789abcdef0123456789abcdef", "ny-cta", 1, "standard"], // 5f
        ["f".repeat(32), "ny-cta", 1, "test"], // 93
        ["a".repeat(32), "ny-cta", 1, "test"], // ba
    ])("id %s, nøkkel %s, versjon %s gir %s", async (id, key, version, expected) => {
        expect(await computeVariant(key, version, id)).toBe(expected);
    });

    it("bruker kanonisk hash-input", () => {
        expect(buildHashInput("ny-cta", 1, ZERO_ID)).toBe(`["v1","ny-cta",1,"${ZERO_ID}"]`);
    });

    it.each([
        ["for kort id", "abc", 1],
        ["id med store bokstaver", "A".repeat(32), 1],
        ["versjon 0", ZERO_ID, 0],
        ["versjon med desimal", ZERO_ID, 1.5],
    ])("avviser %s", async (_name, id, version) => {
        await expect(computeVariant("ny-cta", version, id)).rejects.toThrow(RangeError);
    });
});

describe("evaluateExperiment", () => {
    it("tildeler variant for aktivt eksperiment", async () => {
        expect(await evaluateExperiment(makeDefinition(), ZERO_ID, NOW)).toEqual({
            state: "assigned",
            variant: "standard",
            assignmentVersion: 1,
        });
    });

    it.each([
        ["off", makeDefinition({ status: "off" }), ZERO_ID],
        ["expired", makeDefinition({ endsAt: "2026-01-01T00:00:00Z" }), ZERO_ID],
        ["invalid", makeDefinition(), "ikke-en-id"],
    ] as const)("gir standard uten tildeling når tilstanden er %s", async (state, definition, id) => {
        expect(await evaluateExperiment(definition, id, NOW)).toEqual({ state, variant: "standard" });
    });
});
