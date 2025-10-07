import { describe, it, expect } from "vitest";
import { sanitizeAdText } from "@/app/stillinger/_common/lib/ad-model/transform/ad-text";

describe("ad-text", () => {
    it("linkifies email and sanitizes", () => {
        const out = sanitizeAdText("Kontakt oss: person&#64;example.com");
        expect(out?.includes("mailto:person@example.com")).toBe(true);
        const out2 = sanitizeAdText("Kontakt oss: person@example.com");
        expect(out2?.includes("mailto:person@example.com")).toBe(true);
    });
});
