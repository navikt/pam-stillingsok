import { describe, expect, test } from "vitest";
import { type FilterAggregation } from "@/app/(nonce)/stillinger/_common/types/FilterAggregations";
import sortPublishedFiltersByDayOffset from "@/app/(nonce)/stillinger/(sok)/_components/utils/sortPublishedFiltersByDayOffset";

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
