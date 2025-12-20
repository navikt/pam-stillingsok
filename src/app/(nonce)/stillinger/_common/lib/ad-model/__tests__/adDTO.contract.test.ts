import { describe, it, expect } from "vitest";
import { unwrapOk } from "@/app/(nonce)/stillinger/_common/lib/ad-model/core/result-utils";
import { transformAdDataLegacy } from "@/app/(nonce)/stillinger/_common/lib/ad-model/transform/transform";
import { AdDTO, elasticHitToAdDTOResult } from "@/app/(nonce)/stillinger/_common/lib/ad-model"; // din barrel
import { baseHit } from "@/app/(nonce)/stillinger/_common/lib/ad-model/__tests__/__fixtures__/elasticHit.fixture";
import { FAKE_ID } from "@/app/(nonce)/stillinger/_common/lib/ad-model/__tests__/__fixtures__/ids";

const cases = [
    {
        name: "legacy",
        arrange: (() => {
            const raw = {
                id: 123,
                title: "Utvikler",
                published: "2025-09-30T12:00:00Z",
                properties: {
                    hasInterestform: "true",
                    applicationurl: "arbeidsplassen.nav.no/stilling/123",
                    applicationemail: "test@example.com",
                    jobpercentage: "80",
                    workday: ["Ukedager", "Søndag"],
                    adtext: "Kontakt oss på person@example.com",
                    employer: "ACME AS",
                    employerhomepage: "acme.no",
                },
                locationList: [{ city: "Oslo", country: "Norge" }],
            } as const;
            return () => unwrapOk(transformAdDataLegacy(raw));
        })(),
        expectBase(dto: AdDTO) {
            expect(dto.id).toBe("123");
            expect(dto.title).toBe("Utvikler");

            expect(dto.application.hasSuperraskSoknad).toBe(true);
            expect(dto.application.applicationEmail).toBe("test@example.com");
            expect(dto.application.applicationUrl).toBe("https://arbeidsplassen.nav.no/stilling/123");

            expect(dto.jobPercentage).toBe("80%");
            expect(dto.workDays).toEqual(["Ukedager", "Søndag"]);
            expect(dto.employer.name).toBe("ACME AS");

            expect(dto.employer.homepage).toBe("https://acme.no/");
            expect(dto.adTextHtml?.includes("mailto:person@example.com")).toBe(true);
        },
    },
    {
        name: "elastic",
        arrange: (() => {
            return () => unwrapOk(elasticHitToAdDTOResult(baseHit));
        })(),
        expectBase(dto: AdDTO) {
            expect(dto.id).toBe(FAKE_ID);
            expect(dto.title).toBe("Resepsjonist søkes til Fjellstølen");
            expect(dto.status).toBe("ACTIVE");
            expect(dto.source).toBe("Stillingsregistrering");
            expect(dto.medium).toBe("Stillingsregistrering");
            expect(dto.reference).toBe(FAKE_ID);

            expect(dto.published).toBe("2025-10-02T09:34:48.000Z");
            expect(dto.updated).toBe("2025-10-02T09:53:23.680Z");
            expect(dto.expires).toBe("2025-10-22T22:00:00.000Z");

            expect(dto.application.applicationEmail).toBe("maria.nordmann@eksempel.no");

            expect(dto.application.applicationDueDate).toBe("2025-10-23T00:00:00.000Z");
            expect(dto.application.applicationDueLabel).toBeNull();
            expect(dto.application.hasSuperraskSoknad).toBe(false);
            expect(dto.application.applicationUrl).toBeNull();

            expect(dto.positionCount).toBe(1);
            expect(dto.remoteOptions).toBe("Hjemmekontor ikke mulig");
            expect(dto.jobPercentage).toBe("35%");

            expect(dto.workDays).toStrictEqual(["Ukedager", "Lørdag", "Søndag"]);
            expect(dto.workHours).toStrictEqual(["Dagtid", "Kveld"]);
            expect(dto.workLanguages).toStrictEqual(["Norsk", "Engelsk", "Skandinavisk"]);

            expect(dto.employer.name).toBe("Fjellstølen AS");
            expect(dto.employer.orgnr).toBe("912345678");

            expect(dto.employer.homepage).toBe("https://www.dalen-fjell.no/");

            expect(dto.contactList?.[0]).toMatchObject({
                name: "Ola Nordmann",
                email: "ola.nordmann@eksempel.no",
            });

            expect(dto.adTextHtml).toContain("mailto:maria.nordmann@eksempel.no");

            expect(dto.locationList?.[0].city).toBe("Fjellstølen");
            expect(dto.locationList?.[0].country).toBe("NORGE");

            expect(dto.adTextFormat).toBe("strukturert");
        },
    },
] as const;

describe("AdDTO – felles kontrakt via ulike kilder", () => {
    describe.each(cases)("%s", ({ arrange, expectBase }) => {
        it("oppfyller base-kontrakten", () => {
            const dto = arrange();
            expectBase(dto);
        });
    });
});
