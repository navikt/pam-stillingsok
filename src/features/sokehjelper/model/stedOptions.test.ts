import { describe, expect, it } from "vitest";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { buildStedOptions, getFylkeOptions, toStedState } from "./stedOptions";

const locations: readonly SearchLocation[] = [
    { key: "OSLO", label: "Oslo", code: "03", municipals: [{ key: "OSLO.OSLO", label: "Oslo", code: "0301" }] },
    {
        key: "TROMS",
        label: "Troms",
        code: "55",
        municipals: [{ key: "TROMS.TROMSØ", label: "Tromsø", code: "5501" }],
    },
    {
        key: "TELEMARK",
        label: "Telemark",
        code: "40",
        municipals: [{ key: "TELEMARK.BØ", label: "Bø", code: "4010" }],
    },
    {
        key: "NORDLAND",
        label: "Nordland",
        code: "18",
        municipals: [{ key: "NORDLAND.BØ", label: "Bø", code: "1867" }],
    },
    { key: "UTLAND", label: "Utland", code: "999", municipals: [] },
];

describe("stedOptions", () => {
    it("utelater Utland", () => {
        expect(buildStedOptions(locations).some((option) => option.kind === "abroad")).toBe(false);
    });

    it("gir fylkene fra WIZARD_COUNTIES når locations er tom", () => {
        const options = buildStedOptions([]);
        expect(options).toHaveLength(15);
        expect(options.every((option) => option.kind === "county")).toBe(true);
    });

    it("skiller kommuner med likt navn ved å legge til fylke", () => {
        const labels = buildStedOptions(locations).map((option) => option.label);
        expect(labels).toContain("Bø (kommune i Telemark)");
        expect(labels).toContain("Bø (kommune i Nordland)");
        expect(labels).toContain("Tromsø (kommune)");
    });

    it("getFylkeOptions tar med fylker og Oslo, ikke kommuner", () => {
        const labels = getFylkeOptions(buildStedOptions(locations)).map((option) => option.label);
        expect(labels).toEqual(["Oslo", "Troms (fylke)", "Telemark (fylke)", "Nordland (fylke)"]);
    });

    it("toStedState gir county for fylke og Oslo, begge for kommune", () => {
        const byValue = (value: string) => buildStedOptions(locations).find((option) => option.value === value);
        expect(toStedState(byValue("TROMS")!)).toEqual({ county: "TROMS", municipal: null });
        expect(toStedState(byValue("OSLO.OSLO")!)).toEqual({ county: "OSLO", municipal: null });
        expect(toStedState(byValue("TROMS.TROMSØ")!)).toEqual({ county: "TROMS", municipal: "TROMS.TROMSØ" });
    });
});
