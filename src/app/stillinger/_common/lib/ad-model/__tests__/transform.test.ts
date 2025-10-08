import { describe, it, expect } from "vitest";
import { transformAdDataLegacy } from "../transform/transform";
import { unwrapOk } from "@/app/stillinger/_common/lib/ad-model/core/result-utils";

describe("transform", () => {
    it("coercer legacy-typer og gir AdDTO", () => {
        const raw = {
            id: 123,
            title: "Utvikler",
            published: "2025-09-30T12:00:00Z",
            properties: {
                hasInterestform: "true",
                applicationurl: "arbeidsplassen.nav.no/stilling/123",
                applicationemail: "test@example.com",
                jobpercentage: "80%",
                workday: ["Ukedager", "Søndag"],
                adtext: "Kontakt oss på person@example.com",
                employer: "ACME AS",
                employerhomepage: "acme.no",
            },
            locationList: [{ city: "Oslo", country: "Norge" }],
        };

        const res = transformAdDataLegacy(raw);
        const dto = unwrapOk(res);

        expect(dto.id).toBe("123");
        expect(dto.application.hasSuperraskSoknad).toBe(true);
        expect(dto.application.applicationUrl).toBe("https://arbeidsplassen.nav.no/stilling/123");
        expect(dto.application.applicationEmail).toBe("test@example.com");
        expect(dto.jobPercentage).toBe("80%");
        expect(dto.workDays).toEqual(["Ukedager", "Søndag"]);
        expect(dto.employer?.name).toBe("ACME AS");
        expect(dto.employer?.homepage).toBe("https://acme.no");
        expect(dto.adTextHtml?.includes("mailto:person@example.com")).toBe(true);
    });
});
