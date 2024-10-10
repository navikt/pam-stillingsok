import { describe, expect, test } from "vitest";
import { CURRENT_VERSION, migrateSearchParams } from "@/app/(sok)/_utils/versioning/searchParamsVersioning";

describe("searchParamsVersioning", () => {
    test("Should set current version in search params", () => {
        const outdatedPattern = new URLSearchParams([["q", "Utvikler"]]);
        const expectedResult = new URLSearchParams([
            ["q", "Utvikler"],
            ["v", CURRENT_VERSION],
        ]);
        const migratedSearchParams = migrateSearchParams(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });
});
