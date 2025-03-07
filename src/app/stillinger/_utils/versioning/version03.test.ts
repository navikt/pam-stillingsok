import { describe, expect, test } from "vitest";
import { migrateToV3 } from "@/app/stillinger/_utils/versioning/version03";

describe("version03", () => {
    test("Should migrate 'q' into 'occupation' if url also contains 'fields' parameter", () => {
        const outdatedPattern = new URLSearchParams([
            ["q", "Utvikler"],
            ["fields", "occupation"],
        ]);
        const expectedResult = new URLSearchParams([["occupation", "Utvikler"]]);
        const migratedSearchParams = migrateToV3(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });

    test("Should not migrate q if 'fields' parameter doesn't exist", () => {
        const validSearchParams = new URLSearchParams([["q", "Utvikler"]]);
        const expectedResult = new URLSearchParams([["q", "Utvikler"]]);

        const migratedSearchParams = migrateToV3(validSearchParams);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });

    test("Should not change or delete other parameters", () => {
        const outdatedPattern = new URLSearchParams([
            ["q", "Utvikler"],
            ["fields", "occupation"],
            ["validParameter", "test"],
        ]);
        const expectedResult = new URLSearchParams([
            ["validParameter", "test"],
            ["occupation", "Utvikler"],
        ]);
        const migratedSearchParams = migrateToV3(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });
});
