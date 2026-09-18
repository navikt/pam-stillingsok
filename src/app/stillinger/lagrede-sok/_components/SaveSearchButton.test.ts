import { describe, expect, test } from "vitest";
import {
    createSavedSearchUrlSearchParams,
    getSavedSearchFilterKeys,
} from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

describe("test createSavedSearchUrlSearchParams", () => {
    test("should only contain allowed search params", () => {
        const input = new URLSearchParams();
        input.append(QueryNames.SEARCH_STRING, "react");
        input.append(QueryNames.SECTOR, "privat");
        input.append(QueryNames.UNDER18, "true");

        input.append(QueryNames.FROM, "bar"); // should not be included
        input.append(QueryNames.SORT, "bar"); // should not be included
        input.append("foo", "bar"); // should not be included

        const expected = new URLSearchParams();
        expected.append(QueryNames.SEARCH_STRING, "react");
        expected.append(QueryNames.SECTOR, "privat");
        expected.append(QueryNames.UNDER18, "true");

        const result = createSavedSearchUrlSearchParams(input);

        expect(result.toString()).toEqual(expected.toString());
    });

    test("should contain version parameter", () => {
        const input = new URLSearchParams();
        input.append(QueryNames.SEARCH_STRING, "react");
        input.append(QueryNames.URL_VERSION, "1");

        const expected = new URLSearchParams();
        expected.append(QueryNames.SEARCH_STRING, "react");
        expected.append(QueryNames.URL_VERSION, "1");

        const result = createSavedSearchUrlSearchParams(input);

        expect(result.toString()).toEqual(expected.toString());
    });
});

describe("getSavedSearchFilterKeys", () => {
    test("returnerer unike tillatte filternøkler uten filterverdier eller versjon", () => {
        const input = new URLSearchParams();
        input.append(QueryNames.SEARCH_STRING, "navn@eksempel.no");
        input.append(QueryNames.COUNTY, "03");
        input.append(QueryNames.MUNICIPAL, "03.OSLO");
        input.append(QueryNames.EDUCATION, "Bachelor");
        input.append(QueryNames.URL_VERSION, "1");
        input.append(QueryNames.FROM, "20");

        const result = getSavedSearchFilterKeys(input);

        expect(result).toEqual([
            QueryNames.COUNTY,
            QueryNames.EDUCATION,
            QueryNames.MUNICIPAL,
            QueryNames.SEARCH_STRING,
        ]);
        expect(result.join()).not.toContain("navn@eksempel.no");
        expect(result.join()).not.toContain("03.OSLO");
        expect(result).not.toContain(QueryNames.URL_VERSION);
        expect(result).not.toContain(QueryNames.FROM);
    });
});
