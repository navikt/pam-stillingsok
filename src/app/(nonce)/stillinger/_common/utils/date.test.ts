import { describe, expect, it } from "vitest";
import formatISOString from "@/app/(nonce)/stillinger/_common/utils/date";

describe("formatISOString", () => {
    const christmas = "2025-12-24T12:00:00.000Z";
    it("should format date", () => {
        expect(formatISOString(christmas)).toBe("24.12.2025");
    });

    it("should return input date if provided format is not supported", () => {
        expect(formatISOString(christmas, "DD MM YYYY")).toBe(christmas);
    });

    it("should return input if date is invalid", () => {
        expect(formatISOString("24th")).toBe("24th");
    });
});
