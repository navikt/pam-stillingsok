import { describe, it, expect } from "vitest";
import {
    toIsoDate,
    toUrl,
    toEmail,
    toInt,
    toPercent,
    toPercentRange,
    toStringArray,
    cleanString,
} from "@/app/stillinger/_common/lib/ad-model/transform/coercers";

describe("coercers", () => {
    it("toIsoDate", () => {
        expect(toIsoDate("2025-10-02T10:00:00Z")?.startsWith("2025-10-02")).toBe(true);
        expect(toIsoDate("not a date")).toBeNull();
        expect(toIsoDate(undefined)).toBeNull();
    });

    it("toUrl", () => {
        expect(toUrl("example.com")).toBe("https://example.com");
        expect(toUrl("https://nav.no")).toBe("https://nav.no");
        expect(toUrl("://bad")).toBeNull();
    });

    it("toEmail", () => {
        expect(toEmail("a@b.no")).toBe("a@b.no");
        expect(toEmail("nope")).toBeNull();
    });

    it("toInt", () => {
        expect(toInt("10")).toBe(10);
        expect(toInt(5)).toBe(5);
        expect(toInt("x")).toBeNull();
    });

    it("toPercent", () => {
        expect(toPercent("80")).toBe("80%");
        expect(toPercent("80%")).toBe("80%");
        expect(toPercent("a")).toBeNull();
    });

    it("toPercentRange", () => {
        expect(toPercentRange("20-50")).toBe("20% - 50%");
        expect(toPercentRange("20% - 50%")).toBe("20% - 50%");
        expect(toPercentRange("no")).toBeNull();
    });

    it("toStringArray", () => {
        expect(toStringArray('["A","B"]')).toEqual(["A", "B"]);
        expect(toStringArray("A, B")).toEqual(["A", "B"]);
        expect(toStringArray(undefined)).toBeNull();
    });

    it("cleanString", () => {
        expect(cleanString("  x ")).toBe("x");
        expect(cleanString("   ")).toBeNull();
    });
});
