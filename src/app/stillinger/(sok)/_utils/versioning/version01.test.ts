import { describe, expect, test } from "vitest";
import {
    changedOccupations,
    migrateOccupationParam,
    migrateToV1,
} from "@/app/stillinger/(sok)/_utils/versioning/version01";

describe("version01", () => {
    test("Should migrate param", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Utvikling"],
        ]);

        const expectedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Frontend"],
            ["occupationSecondLevels[]", "IT.Backend"],
        ]);

        const migratedSearchParams = migrateOccupationParam(
            "IT.Utvikling",
            ["IT.Frontend", "IT.Backend"],
            outdatedPattern,
        );

        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should append first level param", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Utvikling"],
            ["occupationSecondLevels[]", "IT.Teamleder"],
        ]);

        const expectedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Utvikling"],
            ["occupationFirstLevels[]", "Ledelse"],
            ["occupationSecondLevels[]", "Ledelse.Prosjektleder"],
        ]);

        const migratedSearchParams = migrateOccupationParam("IT.Teamleder", ["Ledelse.Prosjektleder"], outdatedPattern);

        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should replace first level param", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Utvikling"],
        ]);

        const expectedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "Teknologi"],
            ["occupationSecondLevels[]", "Teknologi.Systemutvikling"],
        ]);

        const migratedSearchParams = migrateOccupationParam(
            "IT.Utvikling",
            ["Teknologi.Systemutvikling"],
            outdatedPattern,
        );

        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should not migrate other params", () => {
        const outdatedPattern = new URLSearchParams([
            ["q", "test"],
            ["municipals[]", "Bergen"],
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Utvikling"],
            ["occupationSecondLevels[]", "IT.Design"],
        ]);

        const expectedPattern = new URLSearchParams([
            ["q", "test"],
            ["municipals[]", "Bergen"],
            ["occupationFirstLevels[]", "IT"],
            ["occupationSecondLevels[]", "IT.Design"],
            ["occupationSecondLevels[]", "IT.Frontend"],
            ["occupationSecondLevels[]", "IT.Backend"],
        ]);

        const migratedSearchParams = migrateOccupationParam(
            "IT.Utvikling",
            ["IT.Frontend", "IT.Backend"],
            outdatedPattern,
        );

        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test("Should migrate several params", () => {
        const outdatedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "Utdanning"],
            ["occupationSecondLevels[]", "Utdanning.Forskningsarbeid"],
            ["occupationSecondLevels[]", "Utdanning.SFO, barne- og fritidsleder"],
        ]);
        const expectedPattern = new URLSearchParams([
            ["occupationFirstLevels[]", "Utdanning"],
            ["occupationSecondLevels[]", "Utdanning.Forskningsarbeid"],
            ["occupationFirstLevels[]", "Bygg og anlegg"],
            ["occupationSecondLevels[]", "Bygg og anlegg.Andre ingeniører"],
            ["occupationFirstLevels[]", "Helse og sosial"],
            ["occupationSecondLevels[]", "Helse og sosial.Miljøarbeidere"],
            ["occupationSecondLevels[]", "Helse og sosial.Ledere av omsorgstjenetser for barn"],
        ]);
        const migratedSearchParams = migrateToV1(outdatedPattern);
        expect(migratedSearchParams.toString()).toEqual(expectedPattern.toString());
    });

    test(
        "changeOccupations is supposed to be in the format 'key: [values]' " +
            "where key is old occupations and values are new occupations",
        () => {
            function assertChangedOccupationsCorrectFormat(occupations: Record<string, string[]>) {
                let hasErrors = false;
                for (const occupation in occupations) {
                    if (!Array.isArray(occupations[occupation])) {
                        hasErrors = true;
                    }
                }
                return hasErrors;
            }

            const hasErrors = assertChangedOccupationsCorrectFormat(changedOccupations);
            expect(hasErrors).toBe(false);
        },
    );
});
