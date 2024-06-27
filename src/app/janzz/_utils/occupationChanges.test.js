import { describe, expect, test } from "vitest";
import {
    containsOldOccupations,
    getOccupationsOnlyInFirstLevel,
    rewriteOccupationSearchParams,
} from "@/app/(sok)/_utils/occupationChanges";

expect.extend({
    toContainSameElements: (received, expected) => {
        const { isNot } = this;
        return {
            pass: JSON.stringify(received.sort()) === JSON.stringify(expected.sort()),
            message: () => `expected [${received}] to${isNot ? " not" : ""} contain the same elements as [${expected}]`,
        };
    },
});

const CHANGED_SEARCH_PARAMS = {
    "Helse og sosial.Helse": ["Helse og sosial.Lege"],
    "Utdanning.Forskningsarbeid": ["Bygg og anlegg.Andre ingeniører"],
    "IT.Utvikler": ["IT.Frontendutvikler", "IT.Backendutvikler"],
    "Utdanning.Barnehage": ["Utdanning.Barnehage", "Utdanning.Barnehageassistent"],
};

describe("containsOldOccupations", () => {
    test("Detects old occupations", () => {
        const searchParams = {
            "occupationFirstLevels[]": ["Helse og sosial"],
            "occupationSecondLevels[]": ["Helse og sosial.Helse"],
        };

        const result = containsOldOccupations(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result).toBe(true);
    });

    test("Does not falsely detect changes", () => {
        const searchParams = {
            "occupationFirstLevels[]": ["Helse og sosial"],
            "occupationSecondLevels[]": ["Helse og sosial.Finnes ikke"],
        };

        const result = containsOldOccupations(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result).toBe(false);
    });

    test("Returns false when second level is not used", () => {
        const searchParams = {
            "occupationFirstLevels[]": ["Helse og sosial"],
        };

        const result = containsOldOccupations(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result).toBe(false);
    });

    test("Returns false when nothing", () => {
        const searchParams = {};

        const result = containsOldOccupations(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result).toBe(false);
    });
});

describe("rewriteOccupationSearchParams", () => {
    test("Rewrites old second level occupation - one-to-one mapping", () => {
        const searchParams = {
            "occupationFirstLevels[]": "Helse og sosial",
            "occupationSecondLevels[]": "Helse og sosial.Helse",
        };

        const result = rewriteOccupationSearchParams(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result["occupationFirstLevels[]"]).toContainSameElements(["Helse og sosial"]);
        expect(result["occupationSecondLevels[]"]).toContainSameElements(["Helse og sosial.Lege"]);
    });

    test("Rewrites old second level occupation - one-to-many mapping", () => {
        const searchParams = {
            "occupationFirstLevels[]": "IT",
            "occupationSecondLevels[]": "IT.Utvikler",
        };

        const result = rewriteOccupationSearchParams(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result["occupationFirstLevels[]"]).toContainSameElements(["IT"]);
        expect(result["occupationSecondLevels[]"]).toContainSameElements(["IT.Frontendutvikler", "IT.Backendutvikler"]);
    });

    test("If first level is changed for a second level search, the old first level will be removed", () => {
        const searchParams = {
            "occupationFirstLevels[]": "Utdanning",
            "occupationSecondLevels[]": "Utdanning.Forskningsarbeid",
        };

        const result = rewriteOccupationSearchParams(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result["occupationFirstLevels[]"]).toContainSameElements(["Bygg og anlegg"]);
        expect(result["occupationSecondLevels[]"]).toContainSameElements(["Bygg og anlegg.Andre ingeniører"]);
    });

    test("Will keep first level searches if not used in a second level search", () => {
        const searchParams = {
            "occupationFirstLevels[]": ["Helse og sosial", "IT"],
            "occupationSecondLevels[]": "Helse og sosial.Helse",
        };

        const result = rewriteOccupationSearchParams(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result["occupationFirstLevels[]"]).toContainSameElements(["Helse og sosial", "IT"]);
        expect(result["occupationSecondLevels[]"]).toContainSameElements(["Helse og sosial.Lege"]);
    });

    test("Will keep second level searches if not changed", () => {
        const searchParams = {
            "occupationFirstLevels[]": ["Helse og sosial", "IT"],
            "occupationSecondLevels[]": ["Helse og sosial.Helse", "IT.Databaseadmin"],
        };

        const result = rewriteOccupationSearchParams(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result["occupationFirstLevels[]"]).toContainSameElements(["Helse og sosial", "IT"]);
        expect(result["occupationSecondLevels[]"]).toContainSameElements(["Helse og sosial.Lege", "IT.Databaseadmin"]);
    });

    test("Will keep second level searches not changed", () => {
        const searchParams = {
            "occupationFirstLevels[]": "Utdanning",
            "occupationSecondLevels[]": "Utdanning.Barnehage",
        };

        const result = rewriteOccupationSearchParams(searchParams, CHANGED_SEARCH_PARAMS);

        expect(result["occupationFirstLevels[]"]).toContainSameElements(["Utdanning"]);
        expect(result["occupationSecondLevels[]"]).toContainSameElements([
            "Utdanning.Barnehage",
            "Utdanning.Barnehageassistent",
        ]);
    });
});

describe("getOccupationsOnlyInFirstLevel", () => {
    test("Will find occupations only in first level", () => {
        const searchParams = {
            "occupationFirstLevels[]": "IT",
        };

        const onlyFirstLevel = getOccupationsOnlyInFirstLevel(searchParams);

        expect(onlyFirstLevel).toContainSameElements(["IT"]);
    });

    test("Will find occupations only in first level, when second level is used", () => {
        const searchParams = {
            "occupationFirstLevels[]": ["Helse og sosial", "IT"],
            "occupationSecondLevels[]": "Helse og sosial.Helse",
        };

        const onlyFirstLevel = getOccupationsOnlyInFirstLevel(searchParams);

        expect(onlyFirstLevel).toContainSameElements(["IT"]);
    });
});
