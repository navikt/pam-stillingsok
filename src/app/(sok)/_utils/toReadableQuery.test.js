import { describe, expect, test } from "vitest";
import toReadableQuery from "@/app/(sok)/_utils/toReadableQuery";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";

describe("toReadableQuery", () => {
    test("Should return q value", () => {
        const result = toReadableQuery(new URLSearchParams([[SearchQueryParams.Q, "Utvikler"]]));
        expect(result).toEqual("Utvikler");
    });

    test("Should return locations seperated with comma and 'og'", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.COUNTY, "Oslo"],
                [SearchQueryParams.COUNTY, "Bergen"],
                [SearchQueryParams.COUNTY, "Bodø"],
            ]),
        );
        expect(result).toEqual("Oslo, Bergen og Bodø");
    });

    test("Should return occupations as comma seperated string", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.OCCUPATION_LEVEL_1, "Utvikler"],
                [SearchQueryParams.OCCUPATION_LEVEL_1, "Tester"],
                [SearchQueryParams.OCCUPATION_LEVEL_1, "Designer"],
            ]),
        );
        expect(result).toEqual("Utvikler, Tester, Designer");
    });

    test("Should return sector as comma seperated string", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.SECTOR, "Privat"],
                [SearchQueryParams.SECTOR, "Offentlig"],
            ]),
        );
        expect(result).toEqual("Privat, Offentlig");
    });

    test("Should return extent as comma seperated string", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.EXTENT, "Deltid"],
                [SearchQueryParams.EXTENT, "Heltid"],
            ]),
        );
        expect(result).toEqual("Deltid, Heltid");
    });

    test("Should return engagementType as comma seperated string", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.ENGAGEMENT_TYPE, "Fast"],
                [SearchQueryParams.ENGAGEMENT_TYPE, "Vikar"],
            ]),
        );
        expect(result).toEqual("Fast, Vikar");
    });

    test("Should return Hjemmekontor if one or more remote values are given", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.REMOTE, "Hybrid"],
                [SearchQueryParams.REMOTE, "Kun hjemmekontor"],
            ]),
        );
        expect(result).toEqual("Hjemmekontor");
    });

    test("Should return locations seperated with comma and 'og'", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.COUNTRY, "Norge"],
                [SearchQueryParams.COUNTRY, "Sverige"],
                [SearchQueryParams.COUNTRY, "Danmark"],
            ]),
        );
        expect(result).toEqual("Norge, Sverige og Danmark");
    });

    test("Should return 'Utland'", () => {
        const result = toReadableQuery(new URLSearchParams([[SearchQueryParams.INTERNATIONAL, true]]));
        expect(result).toEqual("Utland");
    });

    test("Should return occupation as comma seperated string", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.OCCUPATION_LEVEL_1, "Bygg og anlegg"],
                [SearchQueryParams.OCCUPATION_LEVEL_1, "IT"],
            ]),
        );
        expect(result).toEqual("Bygg og anlegg, IT");
    });

    test("Should not return occupation level 1 if a related occupation on level 2 is used", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.OCCUPATION_LEVEL_1, "IT"],
                [SearchQueryParams.OCCUPATION_LEVEL_2, "IT.Utvikling"],
            ]),
        );
        expect(result).toEqual("Utvikling");
    });

    test("Should return substring of occupation level 2", () => {
        const result = toReadableQuery(new URLSearchParams([[SearchQueryParams.OCCUPATION_LEVEL_2, "IT.Utvikling"]]));
        expect(result).toEqual("Utvikling");
    });

    test("Should return substring of municipal", () => {
        const result = toReadableQuery(
            new URLSearchParams([[SearchQueryParams.OCCUPATION_LEVEL_2, "Vestland.Bergen"]]),
        );
        expect(result).toEqual("Bergen");
    });

    test("Should split locations and other filters with 'i'", () => {
        const result = toReadableQuery(
            new URLSearchParams([
                [SearchQueryParams.OCCUPATION_LEVEL_1, "IT"],
                [SearchQueryParams.OCCUPATION_LEVEL_2, "IT.Utvikling"],
                [SearchQueryParams.MUNICIPAL, "Vestland.Bergen"],
            ]),
        );
        expect(result).toEqual("Utvikling i Bergen");
    });

    test("Should return published as readable value", () => {
        const result = toReadableQuery(new URLSearchParams([[SearchQueryParams.PUBLISHED, "now/d"]]));
        expect(result).toEqual("Nye i dag");
    });
});
