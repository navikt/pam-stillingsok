import { describe, expect, it } from "vitest";
import { parseMunicipalKey } from "@/app/_common/geografi/locationKeyParsing";
import { buildLocationFilter } from "@/app/sommerjobb/_utils/sommerjobbElasticSearchRequestBody";

describe("parseMunicipalKey", () => {
    it("parser COUNTY.MUNICIPAL", () => {
        expect(parseMunicipalKey("TROMS.TROMSØ")).toEqual({ countyKey: "TROMS", municipalKey: "TROMSØ" });
    });

    it("returnerer null dersom separator mangler", () => {
        expect(parseMunicipalKey("TROMSØ")).toBeNull();
    });

    it("returnerer null dersom fylke deler av strengen er tom", () => {
        expect(parseMunicipalKey("TROMS.")).toBeNull();
        expect(parseMunicipalKey(".TROMSØ")).toBeNull();
    });

    it("returnerer null dersom det er flere en to deler i strengen", () => {
        expect(parseMunicipalKey("A.B.C")).toBeNull();
    });
});

describe("buildLocationFilter", () => {
    it("faller tilbake til fylke dersom kommune er feil", () => {
        const filter = buildLocationFilter("TROMS", "TROMSØ");
        expect(filter).not.toBeNull();
    });

    it("returnerer null dersom begge verdier er tomme eller ugyldige", () => {
        expect(buildLocationFilter("", "TROMSØ")).toBeNull();
        expect(buildLocationFilter(null, null)).toBeNull();
    });
});
