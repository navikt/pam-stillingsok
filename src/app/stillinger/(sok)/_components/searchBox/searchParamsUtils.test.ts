import { describe, expect, it } from "vitest";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { countActiveFilters } from "./searchParamsUtils";

const locationKeys = [
    QueryNames.COUNTY,
    QueryNames.MUNICIPAL,
    QueryNames.POSTCODE,
    QueryNames.DISTANCE,
    QueryNames.COUNTRY,
    QueryNames.INTERNATIONAL,
];

const occupationKeys = [QueryNames.OCCUPATION, QueryNames.OCCUPATION_FIRST_LEVEL, QueryNames.OCCUPATION_SECOND_LEVEL];

function count(params: string, keys: readonly string[]): number {
    return countActiveFilters(new URLSearchParams(params), keys);
}

describe("countActiveFilters", () => {
    it("teller ett valg per aktiv verdi", () => {
        expect(count("sector=Privat&sector=Offentlig", [QueryNames.SECTOR])).toBe(2);
    });

    it("ignorerer tomme verdier", () => {
        expect(count("sector=&sector=Privat", [QueryNames.SECTOR])).toBe(1);
    });

    it("teller needDriversLicense=false som et valg", () => {
        expect(count("needDriversLicense=false", [QueryNames.NEED_DRIVERS_LICENSE])).toBe(1);
    });

    it("teller postnummer og avstand som ett reiseveifilter", () => {
        expect(count("postcode=0001", locationKeys)).toBe(0);
        expect(count("distance=5", locationKeys)).toBe(0);
        expect(count("postcode=0001&distance=5", locationKeys)).toBe(1);
        expect(count("postcode=001&distance=5", locationKeys)).toBe(0);
        expect(count("postcode=0001&distance=0", locationKeys)).toBe(0);
    });

    it("teller ikke forelder når et underfilter er valgt", () => {
        expect(count("county=TROMS", locationKeys)).toBe(1);
        expect(count("county=TROMS&municipal=TROMS.HARSTAD", locationKeys)).toBe(1);
        expect(count("county=TROMS&municipal=TROMS.HARSTAD&municipal=TROMS.BARDU", locationKeys)).toBe(2);
        expect(count("county=TROMS&municipal=TROMS.HARSTAD&county=OSLO", locationKeys)).toBe(2);
    });

    it("teller ikke yrkeskategori på øverste nivå når et underfilter er valgt", () => {
        expect(count("occupationLevel1=Helse", occupationKeys)).toBe(1);
        expect(count("occupationLevel1=Helse&occupationLevel2=Helse.Lege", occupationKeys)).toBe(1);
        expect(
            count(
                "occupationLevel1=Helse&occupationLevel2=Helse.Lege&occupationLevel2=Helse.Sykepleier",
                occupationKeys,
            ),
        ).toBe(2);
    });

    it("teller ikke Utland når et land er valgt", () => {
        expect(count("international=true", locationKeys)).toBe(1);
        expect(count("international=true&country=Sverige", locationKeys)).toBe(1);
        expect(count("country=Sverige", locationKeys)).toBe(1);
        expect(count("international=ukjent&country=Sverige", locationKeys)).toBe(1);
    });
});
