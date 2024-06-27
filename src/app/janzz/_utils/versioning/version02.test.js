import { describe, expect, test } from "vitest";
import { migrateToV2 } from "@/app/(sok)/_utils/versioning/version02";

describe("version02", () => {
    test("Should migrate all outdated search params", () => {
        const outdatedSearchParams = {
            "occupationFirstLevels[]": ["a", "b"],
            "occupationSecondLevels[]": ["a", "b"],
            "municipals[]": ["a", "b"],
            "counties[]": ["a", "b"],
            "countries[]": ["a", "b"],
            "extent[]": ["a", "b"],
            "engagementType[]": ["a", "b"],
            "sector[]": ["a", "b"],
            "education[]": ["a", "b"],
            "workLanguage[]": ["a", "b"],
            "remote[]": ["a", "b"],
        };

        const expectedResult = {
            occupationLevel1: ["a", "b"],
            occupationLevel2: ["a", "b"],
            municipal: ["a", "b"],
            county: ["a", "b"],
            country: ["a", "b"],
            extent: ["a", "b"],
            engagementType: ["a", "b"],
            sector: ["a", "b"],
            education: ["a", "b"],
            workLanguage: ["a", "b"],
            remote: ["a", "b"],
        };

        const migratedSearchParams = migrateToV2(outdatedSearchParams);
        expect(migratedSearchParams).toEqual(expectedResult);
    });

    test("Should not delete or change valid search params", () => {
        const validSearchParams = {
            validSearchParam: ["a", "b"],
        };
        const expectedResult = {
            validSearchParam: ["a", "b"],
        };

        const migratedSearchParams = migrateToV2(validSearchParams);
        expect(migratedSearchParams).toEqual(expectedResult);
    });
});
