import { describe, expect, it } from "vitest";
import { buildSearchUrl } from "./buildSearchUrl";
import type { WizardState } from "./sokehjelperTypes";

const BASE_STATE: WizardState = {
    jobbtypes: [],
    steder: [],
    county: null,
    yrker: [],
    fritekst: "",
    aktivtSteg: 4,
};

describe("buildSearchUrl", () => {
    it("returnerer /stillinger uten params når ingen valg er gjort", () => {
        expect(buildSearchUrl(BASE_STATE)).toBe("/stillinger");
    });

    it("returnerer /stillinger uten params for bytte-jobb uten sted og yrke", () => {
        expect(buildSearchUrl({ ...BASE_STATE, jobbtypes: ["bytte-jobb"] })).toBe("/stillinger");
    });

    it("genererer hasSuperraskSoknad=true for superrask", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtypes: ["superrask"] });
        expect(url).toBe("/stillinger?hasSuperraskSoknad=true");
    });
    it("genererer isSummerJob=true for sommerjobb", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtypes: ["sommerjobb"] });
        expect(url).toBe("/stillinger?isSummerJob=true");
    });

    it("genererer extent=Deltid for deltid", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtypes: ["deltid"] });
        expect(url).toBe("/stillinger?extent=Deltid");
    });

    it("genererer experience=Ingen for foerste-jobb", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtypes: ["foerste-jobb"] });
        expect(url).toBe("/stillinger?experience=Ingen");
    });

    it("kombinerer sommerjobb og deltid korrekt", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtypes: ["sommerjobb", "deltid"] });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.get("isSummerJob")).toBe("true");
        expect(params.get("extent")).toBe("Deltid");
    });

    it("kombinerer hjemmekontor-sted og et fylke korrekt", () => {
        const url = buildSearchUrl({ ...BASE_STATE, steder: ["hjemmekontor", "sted"], county: "OSLO" });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
        expect(params.get("county")).toBe("OSLO");
    });

    it("genererer county=OSLO for steder=sted med Oslo", () => {
        const url = buildSearchUrl({ ...BASE_STATE, steder: ["sted"], county: "OSLO" });
        expect(url).toBe("/stillinger?county=OSLO");
    });

    it("inkluderer ikke county når steder=hele-landet", () => {
        const url = buildSearchUrl({ ...BASE_STATE, steder: ["hele-landet"], county: "OSLO" });
        expect(url).toBe("/stillinger");
    });

    it("legger til remote Kun/Delvis hjemmekontor for steder=hjemmekontor", () => {
        const url = buildSearchUrl({ ...BASE_STATE, jobbtypes: ["deltid"], steder: ["hjemmekontor"] });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
        expect(params.get("extent")).toBe("Deltid");
    });

    it("genererer korrekt occupationLevel1 for helse", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["helse"] });
        expect(url).toBe("/stillinger?occupationLevel1=Helse+og+sosial");
    });

    it("genererer korrekt occupationLevel1 for butikk", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["butikk"] });
        expect(url).toBe("/stillinger?occupationLevel1=Salg+og+service");
    });

    it("genererer korrekt occupationLevel1 for skole", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["skole"] });
        expect(url).toBe("/stillinger?occupationLevel1=Utdanning");
    });

    it("genererer korrekt occupationLevel1 for restaurant", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["restaurant"] });
        expect(url).toBe("/stillinger?occupationLevel1=Reiseliv+og+mat");
    });

    it("genererer korrekt occupationLevel1 for transport", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["transport"] });
        expect(url).toBe("/stillinger?occupationLevel1=Transport+og+lager");
    });

    it("genererer korrekt occupationLevel1 for it", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["it"] });
        expect(url).toBe("/stillinger?occupationLevel1=IT");
    });

    it("legger til flere occupationLevel1 for flervalg yrke", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["helse", "it"] });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.getAll("occupationLevel1")).toEqual(["Helse og sosial", "IT"]);
    });

    it("bruker q-param for fritekst når yrke=annet", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["annet"], fritekst: "kokk" });
        expect(url).toBe("/stillinger?q=kokk");
    });

    it("legger ikke til q-param når yrke=annet men fritekst er tom", () => {
        const url = buildSearchUrl({ ...BASE_STATE, yrker: ["annet"], fritekst: "" });
        expect(url).toBe("/stillinger");
    });

    it("kombinerer deltid + fylke + yrke korrekt", () => {
        const url = buildSearchUrl({
            ...BASE_STATE,
            jobbtypes: ["deltid"],
            steder: ["sted"],
            county: "OSLO",
            yrker: ["helse"],
        });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.get("extent")).toBe("Deltid");
        expect(params.get("county")).toBe("OSLO");
        expect(params.get("occupationLevel1")).toBe("Helse og sosial");
    });

    it("kombinerer sommerjobb + hjemmekontor-sted + it korrekt", () => {
        const url = buildSearchUrl({
            ...BASE_STATE,
            jobbtypes: ["sommerjobb"],
            steder: ["hjemmekontor"],
            yrker: ["it"],
        });
        const params = new URLSearchParams(url.split("?")[1]);
        expect(params.get("isSummerJob")).toBe("true");
        expect(params.getAll("remote")).toEqual(["Kun hjemmekontor", "Delvis hjemmekontor"]);
        expect(params.get("occupationLevel1")).toBe("IT");
    });
});
