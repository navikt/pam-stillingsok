import { describe, expect, test } from "vitest";
import { migrateToV6 } from "@/app/stillinger/(sok)/_utils/versioning/version06";

describe("version06", () => {
    test("Should migrate Ingen to ingen krav til arbeidserfaring", () => {
        const outdatedPattern = new URLSearchParams([["experience", "Ingen"]]);
        const expectedPattern = new URLSearchParams([["experience", "ingen krav til arbeidserfaring"]]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should migrate Noe to noe arbeidserfaring", () => {
        const outdatedPattern = new URLSearchParams([["experience", "Noe"]]);
        const expectedPattern = new URLSearchParams([["experience", "noe arbeidserfaring"]]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should migrate Mye to mye arbeidserfaring", () => {
        const outdatedPattern = new URLSearchParams([["experience", "Mye"]]);
        const expectedPattern = new URLSearchParams([["experience", "mye arbeidserfaring"]]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should migrate multiple experience values", () => {
        const outdatedPattern = new URLSearchParams([
            ["experience", "Ingen"],
            ["experience", "Noe"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["experience", "ingen krav til arbeidserfaring"],
            ["experience", "noe arbeidserfaring"],
        ]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should not change other params", () => {
        const outdatedPattern = new URLSearchParams([
            ["experience", "Ingen"],
            ["q", "test"],
            ["education", "Ingen krav"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["q", "test"],
            ["education", "Ingen krav"],
            ["experience", "ingen krav til arbeidserfaring"],
        ]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should pass through unknown experience values unchanged", () => {
        const outdatedPattern = new URLSearchParams([["experience", "Ukjent verdi"]]);
        const expectedPattern = new URLSearchParams([["experience", "Ukjent verdi"]]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should return params unchanged when no experience param is present", () => {
        const outdatedPattern = new URLSearchParams([["q", "test"]]);
        const migratedSearchParams = migrateToV6(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(outdatedPattern.toString());
    });
});
