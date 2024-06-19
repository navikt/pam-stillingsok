import { describe, expect, test } from "vitest";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";
import toSavedSearch from "@/app/(sok)/_utils/toSavedSearch";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";

describe("toSavedSearch", () => {
    const parametersRelatedToSearch = [
        [SearchQueryParams.COUNTY, "foobar"],
        [SearchQueryParams.COUNTRY, "foobar"],
        [SearchQueryParams.EDUCATION, "foobar"],
        [SearchQueryParams.ENGAGEMENT_TYPE, "foobar"],
        [SearchQueryParams.EXTENT, "foobar"],
        [SearchQueryParams.INTERNATIONAL, "foobar"],
        [SearchQueryParams.MUNICIPAL, "foobar"],
        [SearchQueryParams.NEED_DRIVERS_LICENSE, "foobar"],
        [SearchQueryParams.OCCUPATION, "foobar"],
        [SearchQueryParams.OCCUPATION_LEVEL_1, "foobar"],
        [SearchQueryParams.OCCUPATION_LEVEL_2, "foobar"],
        [SearchQueryParams.PUBLISHED, "foobar"],
        [SearchQueryParams.Q, "foobar"],
        [SearchQueryParams.REMOTE, "foobar"],
        [SearchQueryParams.SECTOR, "foobar"],
        [SearchQueryParams.WORK_LANGUAGE, "foobar"],
    ];

    test("Should contain url parameter for versioning", () => {
        const expected = new URLSearchParams([["v", CURRENT_VERSION]]);
        const result = toSavedSearch(new URLSearchParams());
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should contain current version in v parameter", () => {
        const expected = new URLSearchParams([["v", CURRENT_VERSION]]);
        const result = toSavedSearch(new URLSearchParams([["v", "1"]]));
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should only return parameters related to search", () => {
        const input = new URLSearchParams([["v", CURRENT_VERSION], ...parametersRelatedToSearch]);
        const result = toSavedSearch(input);
        expect(input.toString()).toEqual(result.toString());
    });

    test("Should skip from parameter", () => {
        const expected = new URLSearchParams([["v", CURRENT_VERSION]]);
        const invalid = new URLSearchParams([[SearchQueryParams.FROM, "foobar"]]);
        const result = toSavedSearch(invalid);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should skip size parameter", () => {
        const expected = new URLSearchParams([["v", CURRENT_VERSION]]);
        const invalid = new URLSearchParams([[SearchQueryParams.SIZE, "foobar"]]);
        const result = toSavedSearch(invalid);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should skip sort parameter", () => {
        const expected = new URLSearchParams([["v", CURRENT_VERSION]]);
        const invalid = new URLSearchParams([[SearchQueryParams.SORT, "foobar"]]);
        const result = toSavedSearch(invalid);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should skip any unknown parameters", () => {
        const expected = new URLSearchParams([["v", CURRENT_VERSION]]);
        const invalid = new URLSearchParams([["foo", "bar"]]);
        const result = toSavedSearch(invalid);
        expect(result.toString()).toEqual(expected.toString());
    });
});
