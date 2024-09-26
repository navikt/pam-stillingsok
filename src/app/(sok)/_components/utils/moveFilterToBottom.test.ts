import { describe, expect, test } from "vitest";
import { FilterAggregation } from "@/app/(sok)/_types/FilterAggregations";
import moveFilterToBottom from "@/app/(sok)/_components/utils/moveFilterToBottom";

describe("moveFilterToBottom", () => {
    test("Should move filter to bottom", () => {
        const filters: FilterAggregation[] = [
            { key: "Annet", count: 1 },
            { key: "a", count: 1 },
            { key: "b", count: 1 },
        ];

        const expected: FilterAggregation[] = [
            { key: "a", count: 1 },
            { key: "b", count: 1 },
            { key: "Annet", count: 1 },
        ];

        const result = moveFilterToBottom(filters, "Annet");

        expect(result).toEqual(expected);
    });
});
