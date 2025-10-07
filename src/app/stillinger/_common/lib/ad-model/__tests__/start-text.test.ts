import { describe, it, expect } from "vitest";
import type { IsoDateString } from "@/app/stillinger/_common/lib/ad-model/schemas/primitives";
import { getStartText } from "@/app/stillinger/_common/lib/ad-model/utils/start-text";

describe("getStartText", () => {
    it("formatterer ISO date-only til norsk dato", () => {
        const startDate: IsoDateString = "2025-10-23";
        const text = getStartText({ startDate, startDateLabel: null });
        // NB: med TZ=Europe/Oslo og locale nb
        expect(text).toBe("23. oktober 2025");
    });

    it("bruker label når dato mangler", () => {
        const text = getStartText({ startDate: undefined, startDateLabel: "Snarest" });
        expect(text).toBe("Snarest");
    });

    it("trimmer label og returnerer undefined for tom", () => {
        expect(getStartText({ startDate: undefined, startDateLabel: "   " })).toBeUndefined();
        expect(getStartText({ startDate: undefined, startDateLabel: null })).toBeUndefined();
        expect(getStartText({ startDate: undefined })).toBeUndefined();
    });

    it("ignorerer ugyldig dato og faller tilbake til label", () => {
        const text = getStartText({
            startDate: "ugyldig" as unknown as IsoDateString,
            startDateLabel: "Når som helst",
        });
        expect(text).toBe("Når som helst");
    });
});
