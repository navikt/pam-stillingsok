import { describe, expect, test } from "vitest";
import { type FilterAggregation } from "@/app/(nonce)/stillinger/_common/types/FilterAggregations";
import sortFiltersAlphabetically from "@/app/(nonce)/stillinger/(sok)/_components/utils/sortFiltersAlphabetically";

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
