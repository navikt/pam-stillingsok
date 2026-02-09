import { describe, expect, it } from "vitest";
import { formatSearchSummary } from "@/app/sommerjobb/_utils/formatSearchSummary";
import { normalizeNbSpaces } from "@/app/_common/text/normalizeNbSpaces";

describe("formatSearchSummary", () => {
    it("returnerer korrekt tekst for entall", () => {
        expect(formatSearchSummary(1, 1)).toBe("Vi fant 1 jobb i 1 annonse!");
    });

    it("returnerer korrekt tekst for flertall", () => {
        expect(formatSearchSummary(1, 2)).toBe("Vi fant 1 jobb i 2 annonser!");
    });

    it("Tusentall formateres riktig", () => {
        expect(normalizeNbSpaces(formatSearchSummary(15000, 2400))).toBe("Vi fant 15 000 jobber i 2 400 annonser!");
    });

    it("håndterer kun én jobb og én annonse", () => {
        expect(formatSearchSummary(1, 1)).toBe("Vi fant 1 jobb i 1 annonse!");
    });
});
