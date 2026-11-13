import { describe, expect, it } from "vitest";
import { removeFreeTextParams, stripFreeTextFromPageUrl } from "./stripFreeTextFromPageUrl";

type Item = Parameters<typeof stripFreeTextFromPageUrl>[0];

function itemWithUrl(url: string): Item {
    return { type: "event", payload: {}, meta: { page: { url } } } as unknown as Item;
}

describe("removeFreeTextParams", () => {
    it("fjerner alle q-parametere og beholder de andre", () => {
        expect(
            removeFreeTextParams("https://arbeidsplassen.nav.no/stillinger?q=ønsker+å+jobbe+med+ki&v=6&q=deltid"),
        ).toBe("https://arbeidsplassen.nav.no/stillinger?v=6");
    });

    it("fjerner spørsmålstegnet når q er eneste parameter", () => {
        expect(removeFreeTextParams("https://arbeidsplassen.nav.no/stillinger?q=kokk")).toBe(
            "https://arbeidsplassen.nav.no/stillinger",
        );
    });

    it("beholder fragment", () => {
        expect(removeFreeTextParams("/stillinger?q=kokk&county=OSLO#treff")).toBe("/stillinger?county=OSLO#treff");
    });

    it("lar URL uten q være helt uendret", () => {
        const url = "/stillinger?county=OSLO&occupationLevel1=IT%20og%20data";
        expect(removeFreeTextParams(url)).toBe(url);
    });

    it("rører ikke parametere som bare ligner på q", () => {
        expect(removeFreeTextParams("/stillinger?q=kokk&qs=1&Q=2")).toBe("/stillinger?qs=1&Q=2");
    });
});

describe("stripFreeTextFromPageUrl", () => {
    it("returnerer ny item med renset meta.page.url", () => {
        const result = stripFreeTextFromPageUrl(itemWithUrl("/stillinger?q=kokk&v=6"));
        expect(result?.meta.page?.url).toBe("/stillinger?v=6");
    });

    it("returnerer samme item når meta.page mangler", () => {
        const item = { type: "event", payload: {}, meta: {} } as unknown as Item;
        expect(stripFreeTextFromPageUrl(item)).toBe(item);
    });

    it("muterer ikke input-item", () => {
        const item = itemWithUrl("/stillinger?q=kokk");
        const snapshot = structuredClone(item);
        stripFreeTextFromPageUrl(item);
        expect(item).toEqual(snapshot);
    });
});
