import { describe, expect, test } from "vitest";
import { QueryNames } from "@/app/stillinger/_utils/QueryNames";
import { toSavedSearch } from "@/app/stillinger/lagrede-sok/_components/SaveSearchButton";

describe("test toSavedSearch", () => {
    test("should only contain allowed search params", () => {
        const input = new URLSearchParams();
        input.append(QueryNames.SEARCH_STRING, "react");
        input.append(QueryNames.SECTOR, "privat");
        input.append(QueryNames.FROM, "bar"); // should not be included
        input.append(QueryNames.SORT, "bar"); // should not be included
        input.append("foo", "bar"); // should not be included

        const expected = new URLSearchParams();
        expected.append(QueryNames.SEARCH_STRING, "react");
        expected.append(QueryNames.SECTOR, "privat");

        const result = toSavedSearch(input);

        expect(result.toString()).toEqual(expected.toString());
    });

    test("should contain version parameter", () => {
        const input = new URLSearchParams();
        input.append(QueryNames.SEARCH_STRING, "react");
        input.append(QueryNames.URL_VERSION, "1");

        const expected = new URLSearchParams();
        expected.append(QueryNames.SEARCH_STRING, "react");
        expected.append(QueryNames.URL_VERSION, "1");

        const result = toSavedSearch(input);

        expect(result.toString()).toEqual(expected.toString());
    });
});
