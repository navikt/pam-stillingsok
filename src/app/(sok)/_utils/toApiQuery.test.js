import { describe, expect, test } from "vitest";
import { SearchQueryParams, SEARCH_RESULTS_PER_PAGE } from "@/app/(sok)/_utils/constants";
import toApiQuery from "@/app/(sok)/_utils/toApiQuery";

describe("toApiQuery", () => {
    test("Should return q value", () => {
        const input = {
            [SearchQueryParams.Q]: "test",
        };
        const result = toApiQuery(input);
        expect(result.q).toEqual("test");
    });

    test("Should return occupationFirstLevels array", () => {
        const input = {
            [SearchQueryParams.OCCUPATION_LEVEL_1]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.occupationFirstLevels).toEqual(["a", "b"]);
    });

    test("Should return occupationSecondLevels array", () => {
        const input = {
            [SearchQueryParams.OCCUPATION_LEVEL_2]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.occupationSecondLevels).toEqual(["a", "b"]);
    });

    test("Should return municipals array", () => {
        const input = {
            [SearchQueryParams.MUNICIPAL]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.municipals).toEqual(["a", "b"]);
    });

    test("Should return counties array", () => {
        const input = {
            [SearchQueryParams.COUNTY]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.counties).toEqual(["a", "b"]);
    });

    test("Should return countries array", () => {
        const input = {
            [SearchQueryParams.COUNTRY]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.countries).toEqual(["a", "b"]);
    });

    test("Should return international array", () => {
        const input = {
            [SearchQueryParams.INTERNATIONAL]: "true",
        };
        const result = toApiQuery(input);
        expect(result.international).toEqual(true);
    });

    test("Should return sector array", () => {
        const input = {
            [SearchQueryParams.SECTOR]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.sector).toEqual(["a", "b"]);
    });

    test("Should return extent array", () => {
        const input = {
            [SearchQueryParams.EXTENT]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.extent).toEqual(["a", "b"]);
    });

    test("Should return engagementType array", () => {
        const input = {
            [SearchQueryParams.ENGAGEMENT_TYPE]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.engagementType).toEqual(["a", "b"]);
    });

    test("Should return workLanguage array", () => {
        const input = {
            [SearchQueryParams.WORK_LANGUAGE]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.workLanguage).toEqual(["a", "b"]);
    });

    test("Should return education array", () => {
        const input = {
            [SearchQueryParams.EDUCATION]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.education).toEqual(["a", "b"]);
    });

    test("Should return remote array", () => {
        const input = {
            [SearchQueryParams.REMOTE]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.remote).toEqual(["a", "b"]);
    });

    test("Should return needDriversLicense array", () => {
        const input = {
            [SearchQueryParams.NEED_DRIVERS_LICENSE]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.needDriversLicense).toEqual(["a", "b"]);
    });

    test("Should return occupations array", () => {
        const input = {
            [SearchQueryParams.OCCUPATION]: ["a", "b"],
        };
        const result = toApiQuery(input);
        expect(result.occupations).toEqual(["a", "b"]);
    });

    test("Should return sort value", () => {
        const input = {
            [SearchQueryParams.SORT]: "a",
        };
        const result = toApiQuery(input);
        expect(result.sort).toEqual("a");
    });

    test("Should return published value", () => {
        const input = {
            [SearchQueryParams.PUBLISHED]: "a",
        };
        const result = toApiQuery(input);
        expect(result.published).toEqual("a");
    });

    test("Should return from value", () => {
        const input = {
            [SearchQueryParams.FROM]: "a",
        };
        const result = toApiQuery(input);
        expect(result.from).toEqual("a");
    });

    test("Should return default size value", () => {
        const input = {
            [SearchQueryParams.SIZE]: "",
        };
        const result = toApiQuery(input);
        expect(result.size).toEqual(SEARCH_RESULTS_PER_PAGE);
    });

    test("Should return default size value if size is not supported", () => {
        const input = {
            [SearchQueryParams.SIZE]: "9999",
        };
        const result = toApiQuery(input);
        expect(result.size).toEqual(SEARCH_RESULTS_PER_PAGE);
    });

    test("Size value should be a number", () => {
        const input = {
            [SearchQueryParams.SIZE]: "100",
        };
        const result = toApiQuery(input);
        expect(result.size).toBeTypeOf("number");
    });

    test("Should not return unknown parameters", () => {
        const input = {
            foo: "bar",
        };
        const result = toApiQuery(input);
        expect(result.foo).toBeUndefined();
    });
});
