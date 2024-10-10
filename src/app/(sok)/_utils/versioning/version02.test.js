import { describe, expect, test } from "vitest";
import { migrateToV2 } from "@/app/(sok)/_utils/versioning/version02";

describe("version02", () => {
    test("Should migrate all outdated search params", () => {
        const outdatedSearchParams = new URLSearchParams([
            ["occupationFirstLevels[]", "a"],
            ["occupationSecondLevels[]", "a"],
            ["municipals[]", "a"],
            ["counties[]", "a"],
            ["countries[]", "a"],
            ["extent[]", "a"],
            ["engagementType[]", "a"],
            ["sector[]", "a"],
            ["education[]", "a"],
            ["workLanguage[]", "a"],
            ["remote[]", "a"],
        ]);

        const expectedResult = new URLSearchParams([
            ["occupationLevel1", "a"],
            ["occupationLevel2", "a"],
            ["municipal", "a"],
            ["county", "a"],
            ["country", "a"],
            ["extent", "a"],
            ["engagementType", "a"],
            ["sector", "a"],
            ["education", "a"],
            ["workLanguage", "a"],
            ["remote", "a"],
        ]);

        const migratedSearchParams = migrateToV2(outdatedSearchParams);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });

    test("Should not delete or change valid search params", () => {
        const validSearchParams = new URLSearchParams([
            ["occupationLevel1", "a"],
            ["occupationLevel2", "a"],
            ["municipal", "a"],
            ["county", "a"],
            ["country", "a"],
            ["extent", "a"],
            ["engagementType", "a"],
            ["sector", "a"],
            ["education", "a"],
            ["workLanguage", "a"],
            ["remote", "a"],
        ]);
        const expectedResult = new URLSearchParams([
            ["occupationLevel1", "a"],
            ["occupationLevel2", "a"],
            ["municipal", "a"],
            ["county", "a"],
            ["country", "a"],
            ["extent", "a"],
            ["engagementType", "a"],
            ["sector", "a"],
            ["education", "a"],
            ["workLanguage", "a"],
            ["remote", "a"],
        ]);

        const migratedSearchParams = migrateToV2(validSearchParams);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });

    test("Should migrate all params with same param name", () => {
        const validSearchParams = new URLSearchParams([
            ["occupationFirstLevels[]", "IT"],
            ["occupationFirstLevels[]", "UTDANNING"],
        ]);
        const expectedResult = new URLSearchParams([
            ["occupationLevel1", "IT"],
            ["occupationLevel1", "UTDANNING"],
        ]);

        const migratedSearchParams = migrateToV2(validSearchParams);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });

    test("Should not delete other params", () => {
        const validSearchParams = new URLSearchParams([["foo", "bar"]]);
        const expectedResult = new URLSearchParams([["foo", "bar"]]);

        const migratedSearchParams = migrateToV2(validSearchParams);
        expect(migratedSearchParams.toString()).toEqual(expectedResult.toString());
    });
});
