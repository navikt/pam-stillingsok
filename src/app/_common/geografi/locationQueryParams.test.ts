import { normalizeLocationQueryState } from "@/app/_common/geografi/locationQueryParams";

describe("normalizeLocationQueryState", () => {
    it("beholder kun fylke når kommune mangler", () => {
        expect(normalizeLocationQueryState({ county: "OSLO", municipal: null })).toEqual({
            county: "OSLO",
            municipal: null,
        });
    });

    it("utleder fylke fra kommune og overstyrer inkonsistent fylke", () => {
        expect(normalizeLocationQueryState({ county: "OSLO", municipal: "TROMS.TROMSØ" })).toEqual({
            county: "TROMS",
            municipal: "TROMS.TROMSØ",
        });
    });

    it("nuller kommune når ugyldig (mangler '.') og beholder fylke", () => {
        expect(normalizeLocationQueryState({ county: "TROMS", municipal: "TROMSØ" })).toEqual({
            county: "TROMS",
            municipal: null,
        });
    });

    it("nuller kommune når ugyldig (tom høyreside)", () => {
        expect(normalizeLocationQueryState({ county: null, municipal: "TROMS." })).toEqual({
            county: null,
            municipal: null,
        });
    });

    it("nuller kommune når ugyldig (flere '.')", () => {
        expect(normalizeLocationQueryState({ county: null, municipal: "A.B.C" })).toEqual({
            county: null,
            municipal: null,
        });
    });

    it("trimmer mellomrom og parser fortsatt korrekt", () => {
        expect(normalizeLocationQueryState({ county: null, municipal: "  TROMS.TROMSØ  " })).toEqual({
            county: "TROMS",
            municipal: "TROMS.TROMSØ",
        });
    });
});
