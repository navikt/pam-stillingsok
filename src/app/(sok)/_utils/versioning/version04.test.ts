import { describe, expect, test } from "vitest";
import { migrateToV4 } from "@/app/(sok)/_utils/versioning/version04";

describe("version04", () => {
    test("Should migrate 'q' into array", () => {
        const outdatedPattern = {
            q: "Utvikler",
        };
        const expectedResult = {
            q: ["Utvikler"],
        };
        const migratedSearchParams = migrateToV4(outdatedPattern);
        expect(migratedSearchParams).toEqual(expectedResult);
    });

    test("Should split q by whitespace into array", () => {
        const outdatedPattern = {
            q: "Utvikler NAV-IT",
        };
        const expectedResult = {
            q: ["Utvikler", "NAV-IT"],
        };
        const migratedSearchParams = migrateToV4(outdatedPattern);
        expect(migratedSearchParams).toEqual(expectedResult);
    });

    test("Should not migrate 'q' if undefined", () => {
        const outdatedPattern = {};
        const expectedResult = {};
        const migratedSearchParams = migrateToV4(outdatedPattern);
        expect(migratedSearchParams).toEqual(expectedResult);
    });

    test("Should not migrate 'q' if blank", () => {
        const outdatedPattern = {
            q: "",
        };
        const expectedResult = {};
        const migratedSearchParams = migrateToV4(outdatedPattern);
        expect(migratedSearchParams).toEqual(expectedResult);
    });
});
