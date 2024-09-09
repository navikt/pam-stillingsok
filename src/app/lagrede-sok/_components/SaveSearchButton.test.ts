import { describe, expect, test } from "vitest";
import { FROM, SEARCH_STRING, SECTOR, SIZE, SORT, URL_VERSION } from "@/app/(sok)/_components/searchParamNames";
import { toSavedSearch } from "@/app/lagrede-sok/_components/SaveSearchButton";

describe("test toSavedSearch", () => {
    test("should only contain allowed search params", () => {
        const input = new URLSearchParams();
        input.append(SEARCH_STRING, "react");
        input.append(SECTOR, "privat");
        input.append(FROM, "bar"); // should not be included
        input.append(SIZE, "bar"); // should not be included
        input.append(SORT, "bar"); // should not be included
        input.append("foo", "bar"); // should not be included

        const expected = new URLSearchParams();
        expected.append(SEARCH_STRING, "react");
        expected.append(SECTOR, "privat");

        const result = toSavedSearch(input);

        expect(result.toString()).toEqual(expected.toString());
    });

    test("should contain version parameter", () => {
        const input = new URLSearchParams();
        input.append(SEARCH_STRING, "react");
        input.append(URL_VERSION, "1");

        const expected = new URLSearchParams();
        expected.append(SEARCH_STRING, "react");
        expected.append(URL_VERSION, "1");

        const result = toSavedSearch(input);

        expect(result.toString()).toEqual(expected.toString());
    });
});
