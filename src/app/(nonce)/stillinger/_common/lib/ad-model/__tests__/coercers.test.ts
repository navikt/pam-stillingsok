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
} from "@/app/(nonce)/stillinger/_common/lib/ad-model/transform/coercers";

describe("coercers", () => {
    it("toIsoDate", () => {
        expect(toIsoDate("2025-10-02T10:00:00Z")?.startsWith("2025-10-02")).toBe(true);
        expect(toIsoDate("not a date")).toBeNull();
        expect(toIsoDate(undefined)).toBeNull();
    });

    describe("toUrl", () => {
        it.each<readonly [input: string, expected: string]>([
            ["arbeidsplassen.no", "https://arbeidsplassen.no/"], // legg til https + normaliser
            ["www.arbeidsplassen.no/", "https://www.arbeidsplassen.no/"], // legg til https, behold /
            ["https://arbeidsplassen.no", "https://arbeidsplassen.no/"], // normaliser origin → trailing slash
            ["http://arbeidsplassen.no", "http://arbeidsplassen.no/"], // behold http, normaliser slash
            ["https://arbeidsplassen.no/path", "https://arbeidsplassen.no/path"], // path → ingen ekstra slash
            ["https://arbeidsplassen.no?x=1", "https://arbeidsplassen.no/?x=1"], // origin + query → '/?'
            ["  arbeidsplassen.no  ", "https://arbeidsplassen.no/"], // trim
        ])("normaliserer '%s' → '%s'", (input, expected) => {
            expect(toUrl(input)).toBe(expected);
        });

        it.each<readonly [input: unknown]>([
            [""],
            ["   "],
            [null],
            [undefined],
            [123],
            ["javascript:alert(1)"],
            ["data:text/html,hi"],
        ])("avviser '%s'", (input) => {
            expect(toUrl(input)).toBeNull();
        });
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
