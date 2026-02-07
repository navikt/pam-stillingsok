import { describe, expect, it } from "vitest";
import {
    deriveCountyKeyFromMunicipalKey,
    normalizeLocationQueryState,
    readLocationQueryState,
} from "@/app/sommerjobb/_utils/locationQueryParams";

describe("locationQueryParams", () => {
    it("deriveCountyKeyFromMunicipalKey returnerer fylkesdelen", () => {
        expect(deriveCountyKeyFromMunicipalKey("TROMS.TROMSØ")).toBe("TROMS");
    });

    it("normalizeLocationQueryState utleder fylke når kommune er angitt", () => {
        const normalized = normalizeLocationQueryState({ county: null, municipal: "TROMS.TROMSØ" });
        expect(normalized).toEqual({ county: "TROMS", municipal: "TROMS.TROMSØ" });
    });

    it("readLocationQueryState returnerer null for manglende/tomme parametere", () => {
        const params = new URLSearchParams(`county=&municipal=   `);
        expect(readLocationQueryState(params)).toEqual({ county: null, municipal: null });
    });
});
