import { describe, expect, test } from "vitest";
import { FilterAggregation } from "@/app/stillinger/_types/FilterAggregations";
import sortEducationsFiltersByLevel from "@/app/stillinger/_components/utils/sortEducationsFiltersByLevel";

describe("sortEducationsFiltersByLevel", () => {
    test("Should sort education filters by education level", () => {
        const filters: FilterAggregation[] = [
            { key: "Bachelor", count: 1 },
            { key: "Ingen krav", count: 1 },
            { key: "Videregående", count: 1 },
            { key: "Forskningsgrad", count: 1 },
            { key: "Fagskole", count: 1 },
            { key: "Master", count: 1 },
            { key: "Fagbrev", count: 1 },
        ];

        const expected: FilterAggregation[] = [
            { key: "Ingen krav", count: 1 },
            { key: "Videregående", count: 1 },
            { key: "Fagbrev", count: 1 },
            { key: "Fagskole", count: 1 },
            { key: "Bachelor", count: 1 },
            { key: "Master", count: 1 },
            { key: "Forskningsgrad", count: 1 },
        ];

        const result = sortEducationsFiltersByLevel(filters);

        expect(result).toEqual(expected);
    });
});
