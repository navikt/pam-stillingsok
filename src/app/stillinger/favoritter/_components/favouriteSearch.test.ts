import { describe, expect, it } from "vitest";
import { createFavouriteSearch } from "./favouriteSearch";

describe("createFavouriteSearch", () => {
    it("treats an empty or whitespace-only search as inactive", () => {
        const search = createFavouriteSearch(" \t\n ");

        expect(search.active).toBe(false);
        expect(search.matches({ title: "Utvikler" })).toBe(true);
    });

    it("trims and splits the search into words", () => {
        const search = createFavouriteSearch("  utvikler \t Tromsø  ");

        expect(search.matches({ title: "Utvikler", location: "Tromsø" })).toBe(true);
        expect(search.matches({ title: "Utvikler" })).toBe(false);
        expect(search.matches({ title: null, employer: undefined, location: null })).toBe(false);
    });

    it("requires every word but allows them to match different fields in any order", () => {
        const search = createFavouriteSearch("Tromsø C++");

        expect(search.matches({ title: "C++-utvikler", location: "Tromsø" })).toBe(true);
        expect(search.matches({ title: "C++-utvikler", location: "Bergen" })).toBe(false);
    });

    it("matches without regard to case using Norwegian locale rules", () => {
        expect(createFavouriteSearch("UTVIKLER").matches({ title: "Utvikler" })).toBe(true);
    });

    it("matches canonically equivalent Unicode", () => {
        expect(createFavouriteSearch("Ålesund").matches({ location: "A\u030Alesund" })).toBe(true);
    });

    it("folds Norwegian and accented letters only for ASCII search words", () => {
        expect(
            createFavouriteSearch("tromso baerum alesund cafe").matches({
                title: "Bærum",
                employer: "Café",
                location: "Tromsø Ålesund",
            }),
        ).toBe(true);
        expect(createFavouriteSearch("får").matches({ title: "far" })).toBe(false);
        expect(createFavouriteSearch("far").matches({ title: "får" })).toBe(true);
    });

    it.each([".", "[]", "+"])("treats %s literally", (word) => {
        expect(createFavouriteSearch(word).matches({ title: `Felt ${word} verdi` })).toBe(true);
        expect(createFavouriteSearch(word).matches({ title: "Felt verdi" })).toBe(false);
    });
});
