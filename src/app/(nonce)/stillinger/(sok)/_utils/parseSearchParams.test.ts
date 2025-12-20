import { describe, expect, test } from "vitest";
import { parseSearchParams } from "@/app/(nonce)/stillinger/(sok)/_utils/parseSearchParams";

describe("parseSearchParams", () => {
    test("Should parse url param to object member", () => {
        const urlSearchParams = new URLSearchParams([["q", "Utvikler"]]);
        const expectedResult = {
            q: "Utvikler",
        };
        const searchParamsObject = parseSearchParams(urlSearchParams);
        expect(searchParamsObject).toEqual(expectedResult);
    });

    test("Should parse multiple params with same name into array", () => {
        const urlSearchParams = new URLSearchParams([
            ["extent", "Deltid"],
            ["extent", "Heltid"],
        ]);
        const expectedResult = {
            extent: ["Deltid", "Heltid"],
        };
        const searchParamsObject = parseSearchParams(urlSearchParams);
        expect(searchParamsObject).toEqual(expectedResult);
    });
});
