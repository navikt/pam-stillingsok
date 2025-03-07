import { describe, expect, test } from "vitest";
import { FilterAggregation } from "@/app/stillinger/_types/FilterAggregations";
import sortFiltersAlphabetically from "@/app/stillinger/_components/utils/sortFiltersAlphabetically";

describe("sortFiltersAlphabetically", () => {
    test("Should sort filters alphabetically", () => {
        const filters: FilterAggregation[] = [
            { key: "a", count: 1 },
            { key: "a2", count: 1 },
            { key: "a1", count: 1 },
            { key: "c", count: 1 },
            { key: "b", count: 1 },
        ];

        const expected: FilterAggregation[] = [
            { key: "a", count: 1 },
            { key: "a1", count: 1 },
            { key: "a2", count: 1 },
            { key: "b", count: 1 },
            { key: "c", count: 1 },
        ];

        const result = sortFiltersAlphabetically(filters);

        expect(result).toEqual(expected);
    });
});
