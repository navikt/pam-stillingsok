import { describe, expect, it } from "vitest";
import { experiments } from "../config";
import { type ExperimentDefinition, validateExperimentRegistry } from "../core/experiments";

const NOW = new Date("2026-06-01T12:00:00Z");

function makeDefinition(overrides: Partial<ExperimentDefinition> = {}): ExperimentDefinition {
    return {
        key: "ny-cta",
        status: "on",
        assignmentVersion: 1,
        owner: "team-arbeidsplassen",
        endsAt: "2026-12-31T23:59:59Z",
        eligiblePathPrefixes: ["/stillinger/stilling/"],
        ...overrides,
    };
}

describe("validateExperimentRegistry", () => {
    it("godtar produksjonsregisteret", () => {
        expect(validateExperimentRegistry(experiments, new Date())).toEqual([]);
    });

    it("godtar gyldig definisjon, også utløpt når den er av", () => {
        expect(validateExperimentRegistry([makeDefinition()], NOW)).toEqual([]);
        expect(
            validateExperimentRegistry([makeDefinition({ status: "off", endsAt: "2020-01-01T00:00:00Z" })], NOW),
        ).toEqual([]);
    });

    it.each<[string, ReadonlyArray<ExperimentDefinition>]>([
        ["nøkkel med understrek", [makeDefinition({ key: "ny_cta" })]],
        ["nøkkel med stor bokstav", [makeDefinition({ key: "Ny-cta" })]],
        ["for kort nøkkel", [makeDefinition({ key: "ab" })]],
        ["reservert nøkkel", [makeDefinition({ key: "uid" })]],
        ["duplisert nøkkel", [makeDefinition(), makeDefinition()]],
        ["ugyldig status", [makeDefinition({ status: "maybe" as never })]],
        ["versjon 0", [makeDefinition({ assignmentVersion: 0 })]],
        ["versjon med desimal", [makeDefinition({ assignmentVersion: 1.5 })]],
        ["versjon over sikkert heltall", [makeDefinition({ assignmentVersion: 2 ** 53 })]],
        ["tom eier", [makeDefinition({ owner: " " })]],
        ["endsAt uten tidssone", [makeDefinition({ endsAt: "2026-12-31T23:59:59" })]],
        ["endsAt som ikke er en dato", [makeDefinition({ endsAt: "i morgen" })]],
        ["aktivt eksperiment som er utløpt", [makeDefinition({ endsAt: "2026-01-01T00:00:00Z" })]],
        ["tom path-liste", [makeDefinition({ eligiblePathPrefixes: [] })]],
        ["path-prefix uten /", [makeDefinition({ eligiblePathPrefixes: ["stillinger"] })]],
    ])("avviser %s", (_name, definitions) => {
        expect(validateExperimentRegistry(definitions, NOW)).not.toEqual([]);
    });
});
