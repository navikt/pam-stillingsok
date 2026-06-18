import { describe, expect, test } from "vitest";
import { createSavedSearchUrlSearchParams } from "@/app/stillinger/(sok)/_components/searchBox/searchParamsUtils";
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
