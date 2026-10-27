import { describe, expect, it } from "vitest";
import { formatLocalTime } from "@/app/stillinger/_common/utils/time";

describe("formatLocalTime", () => {
    it("should format time with two-digit hours and minutes (nb-NO locale)", () => {
        const date = new Date(2025, 0, 1, 9, 5);

        expect(formatLocalTime(date)).toBe("09:05");
    });

    it("should throw when date is invalid", () => {
        const invalidDate = new Date(Number.NaN);

        expect(() => formatLocalTime(invalidDate)).toThrow(RangeError);
    });
});
