import { describe, expect, it } from "vitest";
import { resolveCanonical } from "./resolveCanonical";

describe("resolveCanonical", () => {
    it("returnerer Finn sourceUrl når kilden er finn", () => {
        const canonical = resolveCanonical({
            sourceLower: "finn",
            sourceUrl: "https://www.finn.no/job/ad/440975539",
            adId: "irrelevant",
        });

        expect(canonical).toBe("https://www.finn.no/job/ad/440975539");
    });

    it("returnerer egen canonical for stillingsregistrering", () => {
        const canonical = resolveCanonical({
            sourceLower: "stillingsregistrering",
            sourceUrl: null,
            adId: "abc",
        });

        expect(canonical).toBe("/stillinger/stilling/abc");
    });

    it("returnerer undefined for ukjente kilder (unngår tom canonical-streng)", () => {
        const canonical = resolveCanonical({
            sourceLower: "other",
            sourceUrl: "https://example.com",
            adId: "abc",
        });

        expect(canonical).toBeUndefined();
    });
});
