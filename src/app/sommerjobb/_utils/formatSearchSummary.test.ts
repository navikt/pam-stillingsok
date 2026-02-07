import { describe, expect, it } from "vitest";
import { formatSearchSummary } from "@/app/sommerjobb/_utils/formatSearchSummary";

describe("formatSearchSummary", () => {
    it("returnerer korrekt tekst for entall", () => {
        expect(formatSearchSummary(1, 1)).toBe("Vi fant 1 jobb i 1 annonse!");
    });

    it("returnerer korrekt tekst for flertall", () => {
        expect(formatSearchSummary(1, 2)).toBe("Vi fant 1 jobb i 2 annonser!");
    });

    it("håndterer null jobber og annonser", () => {
        expect(formatSearchSummary(0, 0)).toBe("Vi fant 0 jobber i 0 annonser!");
    });

    it("håndterer kun én jobb og én annonse", () => {
        expect(formatSearchSummary(1, 1)).toBe("Vi fant 1 jobb i 1 annonse!");
    });
});
