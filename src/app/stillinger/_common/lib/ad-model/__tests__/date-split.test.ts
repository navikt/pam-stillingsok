import { describe, it, expect } from "vitest";
import {
    toIsoDateOnly,
    dateOnlyToUtcDateTime,
    splitDateOrLabel,
} from "@/app/stillinger/_common/lib/ad-model/utils/date-split";
import { IsoDateString, IsoDateTimeString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";

describe("splitDateOrLabel", () => {
    it("returnerer {date, undefined} for ISO date-only 'YYYY-MM-DD'", () => {
        const input = "2025-10-19";
        const result = splitDateOrLabel(input);
        expect(result).toEqual({ date: "2025-10-19", label: null });
    });

    it("returnerer {date, undefined} for full ISO datetime", () => {
        const input = "2025-10-19T12:34:56.000Z";
        const result = splitDateOrLabel(input);
        expect(result).toEqual({ date: "2025-10-19", label: null });
    });

    it("parser europeiske formater dd.MM.yyyy", () => {
        const input = "19.10.2025";
        const result = splitDateOrLabel(input);
        expect(result).toEqual({ date: "2025-10-19", label: null });
    });

    it("parser alternative europeiske formater", () => {
        expect(splitDateOrLabel("1.2.2025")).toEqual({ date: "2025-02-01", label: null });
        expect(splitDateOrLabel("01-02-2025")).toEqual({ date: "2025-02-01", label: null });
        expect(splitDateOrLabel("1/2/2025")).toEqual({ date: "2025-02-01", label: null });
    });

    it("trimmer input og returnerer label når ikke dato", () => {
        const result = splitDateOrLabel("  Snarest  ");
        expect(result).toEqual({ date: null, label: "Snarest" });
    });

    it("returnerer {undefined, undefined} for tom/whitespace", () => {
        expect(splitDateOrLabel("")).toEqual({ date: null, label: null });
        expect(splitDateOrLabel("   ")).toEqual({ date: null, label: null });
        expect(splitDateOrLabel(undefined)).toEqual({ date: null, label: null });
        expect(splitDateOrLabel(null)).toEqual({ date: null, label: null });
    });
});

describe("toIsoDateOnly", () => {
    it("formaterer Date til YYYY-MM-DD", () => {
        const d = new Date("2025-10-19T00:00:00.000Z");
        const isoDate = toIsoDateOnly(d);
        const expected: IsoDateString = "2025-10-19";
        expect(isoDate).toBe(expected);
    });
});

describe("dateOnlyToUtcDateTime", () => {
    it("konverterer YYYY-MM-DD til ISO datetime ved UTC midnatt", () => {
        const input: IsoDateString = "2025-10-19";
        const out = dateOnlyToUtcDateTime(input);
        const expected: IsoDateTimeString = "2025-10-19T00:00:00.000Z";
        expect(out).toBe(expected);
    });
});
