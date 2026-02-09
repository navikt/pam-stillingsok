import { describe, expect, it } from "vitest";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import {
    buildLocationWhitelist,
    sanitizeAndNormalizeLocationParams,
} from "@/app/_common/geografi/locationParamSanitizer";

const LOCATIONS: readonly SearchLocation[] = [
    {
        key: "TROMS",
        label: "Troms",
        code: "19",
        municipals: [{ key: "TROMS.TROMSØ", label: "Tromsø", code: "5401" }],
    },
    {
        key: "OSLO",
        label: "Oslo",
        code: "03",
        municipals: [{ key: "OSLO.OSLO", label: "Oslo", code: "0301" }],
    },
    { key: "UTLAND", code: "999", label: "Utland", municipals: [] },
];

describe("sanitizeAndNormalizeLocationParams", () => {
    it("returnerer null når begge parametre mangler eller er tomme", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: null, municipal: null }, whitelist)).toEqual({
            county: null,
            municipal: null,
        });
    });

    it("godtar kun fylke når det finnes i hvitelisten", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS", municipal: null }, whitelist)).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("forkaster fylke når det inneholder '.'", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS.TROMSØ", municipal: null }, whitelist)).toEqual({
            county: null,
            municipal: null,
        });
    });

    it("overstyrer inkonsistent fylke når kommune er gyldig", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "OSLO", municipal: "TROMS.TROMSØ" }, whitelist)).toEqual({
            county: "TROMS",
            municipal: "TROMS.TROMSØ",
        });
    });

    it("forkaster ugyldig kommune og faller tilbake til kun fylke", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS", municipal: "TROMSØ" }, whitelist)).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("forkaster kommune hvis den ikke finnes i hvitelisten", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS", municipal: "TROMS.BARDU" }, whitelist)).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("normaliserer store/små bokstaver og mellomrom før validering", () => {
        const whitelist = buildLocationWhitelist(LOCATIONS);
        expect(
            sanitizeAndNormalizeLocationParams({ county: " tromsø ", municipal: "  tromsø.tromsø  " }, whitelist),
        ).toEqual({
            county: "TROMS",
            municipal: "TROMS.TROMSØ",
        });
    });
});
