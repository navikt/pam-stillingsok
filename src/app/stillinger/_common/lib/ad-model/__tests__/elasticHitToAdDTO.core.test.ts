import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { elasticHitToAdDTOResult } from "@/app/stillinger/_common/lib/ad-model";
import { unwrapOk } from "@/app/stillinger/_common/lib/ad-model/core/result-utils";
import { baseHit } from "@/app/stillinger/_common/lib/ad-model/__tests__/__fixtures__/elasticHit.fixture";
import { FAKE_ID } from "@/app/stillinger/_common/lib/ad-model/__tests__/__fixtures__/ids";

describe("elasticHitToAdDTO – core mapping", () => {
    // Sikre stabil TZ i hele fila (alternativt settes i vitest.config.ts)
    const OLD_TZ = process.env.TZ;
    beforeAll(() => {
        process.env.TZ = "Europe/Oslo";
    });
    afterAll(() => {
        process.env.TZ = OLD_TZ;
    });

    it("konverterer ES hit til AdDTO og normaliserer felter", () => {
        const res = elasticHitToAdDTOResult(baseHit);
        const adDTO = unwrapOk(res);

        expect(adDTO.id).toBe(FAKE_ID);
        expect(adDTO.title).toBe("Resepsjonist søkes til Fjellstølen");
        expect(adDTO.status).toBe("ACTIVE");
        expect(adDTO.source).toBe("Stillingsregistrering");
        expect(adDTO.medium).toBe("Stillingsregistrering");
        expect(adDTO.reference).toBe(FAKE_ID);

        // Dates – verifiser eksakt ISO i UTC
        expect(adDTO.published).toBe("2025-10-02T09:34:48.000Z");
        expect(adDTO.updated).toBe("2025-10-02T09:53:23.680Z");
        expect(adDTO.expires).toBe("2025-10-22T22:00:00.000Z");

        // Application
        expect(adDTO.application.applicationEmail).toBe("maria.nordmann@eksempel.no");
        expect(adDTO.application.applicationDueDate).toBe("2025-10-23T00:00:00.000Z");
        expect(adDTO.application.applicationDueLabel).toBeNull();
        expect(adDTO.application.hasSuperraskSoknad).toBe(false);
        expect(adDTO.application.applicationUrl).toBeNull();

        // Numerics & enums
        expect(adDTO.positionCount).toBe(1);
        expect(adDTO.remoteOptions).toBe("Hjemmekontor ikke mulig");
        expect(adDTO.jobPercentage).toBe("35%");

        // Arrays
        expect(adDTO.workDays).toStrictEqual(["Ukedager", "Lørdag", "Søndag"]);
        expect(adDTO.workHours).toStrictEqual(["Dagtid", "Kveld"]);
        expect(adDTO.workLanguages).toStrictEqual(["Norsk", "Engelsk", "Skandinavisk"]);

        // Employer (obligatorisk – ikke bruk ?. i assertions)
        expect(adDTO.employer.name).toBe("Fjellstølen AS");
        expect(adDTO.employer.orgnr).toBe("912345678");
        expect(adDTO.employer.homepage).toBe("https://www.dalen-fjell.no/");

        // Contacts
        expect(adDTO.contactList?.[0]).toStrictEqual({
            phone: null,
            name: "Ola Nordmann",
            title: null,
            email: "ola.nordmann@eksempel.no",
            role: null,
        });

        expect(adDTO.adTextHtml).toContain("mailto:maria.nordmann@eksempel.no");

        // Location
        expect(adDTO.locationList?.[0].city).toBe("Fjellstølen");
        expect(adDTO.locationList?.[0].country).toBe("NORGE");

        expect(adDTO.adTextFormat).toBe("strukturert");
    });
});
