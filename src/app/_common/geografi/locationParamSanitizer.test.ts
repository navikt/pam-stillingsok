import { describe, expect, it } from "vitest";
import type { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import {
    buildLocationAllowedList,
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
        const allowedList = buildLocationAllowedList(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: null, municipal: null }, allowedList)).toEqual({
            county: null,
            municipal: null,
        });
    });

    it("godtar kun fylke når det finnes i hvitelisten", () => {
        const allowedList = buildLocationAllowedList(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS", municipal: null }, allowedList)).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("forkaster fylke når det inneholder '.'", () => {
        const allowedList = buildLocationAllowedList(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS.TROMSØ", municipal: null }, allowedList)).toEqual({
            county: null,
            municipal: null,
        });
    });

    it("overstyrer inkonsistent fylke når kommune er gyldig", () => {
        const allowedList = buildLocationAllowedList(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "OSLO", municipal: "TROMS.TROMSØ" }, allowedList)).toEqual({
            county: "TROMS",
            municipal: "TROMS.TROMSØ",
        });
    });

    it("forkaster ugyldig kommune og faller tilbake til kun fylke", () => {
        const allowedList = buildLocationAllowedList(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS", municipal: "TROMSØ" }, allowedList)).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("forkaster kommune hvis den ikke finnes i hvitelisten", () => {
        const allowedList = buildLocationAllowedList(LOCATIONS);
        expect(sanitizeAndNormalizeLocationParams({ county: "TROMS", municipal: "TROMS.BARDU" }, allowedList)).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("normaliserer store/små bokstaver og mellomrom før validering", () => {
        const allowedList = buildLocationAllowedList(LOCATIONS);

        expect(
            sanitizeAndNormalizeLocationParams({ county: " troms ", municipal: "  troms.tromsø  " }, allowedList),
        ).toEqual({
            county: "TROMS",
            municipal: "TROMS.TROMSØ",
        });
    });
});
