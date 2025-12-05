import { describe, expect, test } from "vitest";
import { type FilterAggregation } from "@/app/stillinger/_common/types/FilterAggregations";
import sortRemoteFilters from "@/app/stillinger/(sok)/_components/utils/sortRemoteFilters";

describe("sortRemoteFilters", () => {
    test("Should sort filters by expected order", () => {
        const filters: FilterAggregation[] = [
            { key: "Hjemmekontor ikke mulig", count: 1 },
            { key: "Hybridkontor", count: 1 },
            { key: "Hjemmekontor", count: 1 },
        ];

        const expected: FilterAggregation[] = [
            { key: "Hybridkontor", count: 1 },
            { key: "Hjemmekontor", count: 1 },
            { key: "Hjemmekontor ikke mulig", count: 1 },
        ];

        const result = sortRemoteFilters(filters);

        expect(result).toEqual(expected);
    });
});
