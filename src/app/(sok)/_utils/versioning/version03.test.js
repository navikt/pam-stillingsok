import { describe, expect, test } from "vitest";
import { migrateToV3 } from "@/app/(sok)/_utils/versioning/version03";

describe("version03", () => {
    test("Should migrate 'q' into 'occupation' if url also contains 'fields' parameter", () => {
        const outdatedPattern = {
            q: "Utvikler",
            fields: "occupation",
        };
        const expectedResult = {
            occupation: "Utvikler",
        };
        const migratedSearchParams = migrateToV3(outdatedPattern);
        expect(migratedSearchParams).toEqual(expectedResult);
    });

    test("Should not migrate q if 'fields' parameter doesn't exist", () => {
        const validSearchParams = {
            q: "Utvikler",
        };
        const expectedResult = {
            q: "Utvikler",
        };

        const migratedSearchParams = migrateToV3(validSearchParams);
        expect(migratedSearchParams).toEqual(expectedResult);
    });

    test("Should not change or delete other parameters", () => {
        const outdatedPattern = {
            q: "Utvikler",
            fields: "occupation",
            validParameter: "test",
        };
        const expectedResult = {
            occupation: "Utvikler",
            validParameter: "test",
        };
        const migratedSearchParams = migrateToV3(outdatedPattern);
        expect(migratedSearchParams).toEqual(expectedResult);
    });
});
