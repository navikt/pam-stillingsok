import { describe, expect, test } from "vitest";
import { FilterAggregation } from "@/app/stillinger/_common/_types/FilterAggregations";
import sortPublishedFiltersByDayOffset from "@/app/stillinger/(sok)/_components/utils/sortPublishedFiltersByDayOffset";

describe("sortPublishedFiltersByDayOffset", () => {
    test("Should sort filters by days offset", () => {
        const filters: FilterAggregation[] = [
            { key: "now-3d", count: 1 },
            { key: "now-7d", count: 1 },
            { key: "now/d", count: 1 },
        ];

        const expected: FilterAggregation[] = [
            { key: "now/d", count: 1 },
            { key: "now-3d", count: 1 },
            { key: "now-7d", count: 1 },
        ];

        const result = sortPublishedFiltersByDayOffset(filters);

        expect(result).toEqual(expected);
    });
});
