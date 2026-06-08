import { describe, expect, it } from "vitest";
import { buildSearchUrl } from "./buildSearchUrl";
import type { WizardState } from "./sokehjelperTypes";

const BASE_STATE: WizardState = {
    jobbtype: null,
    sted: null,
    county: null,
    yrke: null,
    fritekst: "",
    aktivtSteg: 4,
};

describe("buildSearchUrl", () => {
    it("returnerer /stillinger uten params når ingen valg er gjort", () => {
        expect(buildSearchUrl(BASE_STATE)).toBe("/stillinger");
    });

    it("returnerer /stillinger uten params for vet-hva-jeg-vil", () => {
        expect(buildSearchUrl({ ...BASE_STATE, jobbtype: "vet-hva-jeg-vil" })).toBe("/stillinger");
    });

    it("returnerer /stillinger uten params for usikker uten sted og yrke", () => {
        expect(buildSearchUrl({ ...BASE_STATE, jobbtype: "usikker" })).toBe("/stillinger");
    });

    it("genererer isSummerJob=true for sommerjobb", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtype: "sommerjobb" });
        expect(url).toBe("/stillinger?isSummerJob=true");
    });

    it("genererer extent=Deltid for deltid", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtype: "deltid" });
        expect(url).toBe("/stillinger?extent=Deltid");
    });

    it("genererer experience=Ingen for foerste-jobb", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtype: "foerste-jobb" });
        expect(url).toBe("/stillinger?experience=Ingen");
    });

    it("genererer remote=Kun hjemmekontor og Delvis hjemmekontor for hjemmekontor-jobbtype", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtype: "hjemmekontor" });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
    });

    it("genererer county=OSLO for sted=sted med Oslo", () => {
        const url = buildSearchUrl({ ...BASE_STATE, sted: "sted", county: "OSLO" });
        expect(url).toBe("/stillinger?county=OSLO");
    });

    it("inkluderer ikke county når sted=hele-landet", () => {
        const url = buildSearchUrl({ ...BASE_STATE, sted: "hele-landet", county: "OSLO" });
        expect(url).toBe("/stillinger");
    });

    it("legger til remote Kun/Delvis hjemmekontor for sted=hjemmekontor når jobbtype ikke er hjemmekontor", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtype: "deltid", sted: "hjemmekontor" });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
        expect(params.get("extent")).toBe("Deltid");
    });

    it("legger ikke til remote to ganger når jobbtype=hjemmekontor og sted=hjemmekontor", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtype: "hjemmekontor", sted: "hjemmekontor" });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
    });

    it("genererer korrekt occupationLevel1 for helse", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "helse" });
        expect(url).toBe("/stillinger?occupationLevel1=Helse+og+sosial");
    });

    it("genererer korrekt occupationLevel1 for butikk", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "butikk" });
        expect(url).toBe("/stillinger?occupationLevel1=Salg+og+service");
    });

    it("genererer korrekt occupationLevel1 for skole", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "skole" });
        expect(url).toBe("/stillinger?occupationLevel1=Utdanning");
    });

    it("genererer korrekt occupationLevel1 for restaurant", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "restaurant" });
        expect(url).toBe("/stillinger?occupationLevel1=Reiseliv+og+mat");
    });

    it("genererer korrekt occupationLevel1 for transport", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "transport" });
        expect(url).toBe("/stillinger?occupationLevel1=Transport+og+lager");
    });

    it("genererer korrekt occupationLevel1 for it", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "it" });
        expect(url).toBe("/stillinger?occupationLevel1=IT");
    });

    it("bruker q-param for fritekst når yrke=annet", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "annet", fritekst: "kokk" });
        expect(url).toBe("/stillinger?q=kokk");
    });

    it("legger ikke til q-param når yrke=annet men fritekst er tom", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrke: "annet", fritekst: "" });
        expect(url).toBe("/stillinger");
    });

    it("kombinerer deltid + fylke + yrke korrekt", () => {
        const url = buildSearchUrl({
            ...BASE_STATE,
            jobbtype: "deltid",
            sted: "sted",
            county: "OSLO",
            yrke: "helse",
        });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.get("extent")).toBe("Deltid");
        expect(params.get("county")).toBe("OSLO");
        expect(params.get("occupationLevel1")).toBe("Helse og sosial");
    });

    it("kombinerer sommerjobb + hjemmekontor-sted + it korrekt", () => {
        const url = buildSearchUrl({
            ...BASE_STATE,
            jobbtype: "sommerjobb",
            sted: "hjemmekontor",
            yrke: "it",
        });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.get("isSummerJob")).toBe("true");
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
        expect(params.get("occupationLevel1")).toBe("IT");
    });
});
