import { describe, expect, it } from "vitest";
import fixLocationName from "@/app/stillinger/_common/utils/fixLocationName";

describe("fixLocationName", () => {
    it("should capitalized location", () => {
        expect(fixLocationName("OSLO")).toBe("Oslo");
    });

    it("should capitalized location", () => {
        expect(fixLocationName("oslo")).toBe("Oslo");
    });

    it("should capitalized each word in location", () => {
        expect(fixLocationName("NORDRE LAND")).toBe("Nordre Land");
    });

    it("should capitalized words seperated by '-'", () => {
        expect(fixLocationName("AUST-AGDER")).toBe("Aust-Agder");
    });

    it("should capitalized words seperated by '('", () => {
        expect(fixLocationName("BØ (TELEMARK)")).toBe("Bø (Telemark)");
    });

    it("should not capitalized 'og'", () => {
        expect(fixLocationName("MØRE OG ROMSDAL")).toBe("Møre og Romsdal");
    });

    it("should not capitalized 'i'", () => {
        expect(fixLocationName("BØ I TELEMARK")).toBe("Bø i Telemark");
    });

    it("should fix typo in 'Unjargga Nesseby'", () => {
        expect(fixLocationName("Unjargga Nesseby")).toBe("Unjárga Nesseby");
    });

    it("should split location on '.'", () => {
        expect(fixLocationName("INNLANDET.RINGEBU", true)).toBe("Ringebu");
    });
});
