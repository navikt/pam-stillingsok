import { describe, expect, test } from "vitest";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";
import { setDefaultParameters } from "@/app/(sok)/_utils/useSearchRouter";
import { SearchQueryParams } from "@/app/(sok)/_utils/constants";

describe("useSearchRouter", () => {
    test("Should prepend versioning parameter", () => {
        const expected = new URLSearchParams([
            ["v", CURRENT_VERSION],
            ["foo", "bar"],
        ]);
        const input = new URLSearchParams([["foo", "bar"]]);
        const result = setDefaultParameters(input);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should skip versioning parameter if no other params", () => {
        const expected = new URLSearchParams();
        const input = new URLSearchParams();
        const result = setDefaultParameters(input);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should delete from parameter when search parameters changes", () => {
        const expected = new URLSearchParams([
            ["v", CURRENT_VERSION],
            ["extent", "Deltid"],
        ]);
        const input = new URLSearchParams([
            ["v", CURRENT_VERSION],
            ["extent", "Deltid"],
            [SearchQueryParams.FROM, "25"],
        ]);
        const result = setDefaultParameters(input);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should should not delete from parameter if options.resetFrom is set to false", () => {
        const expected = new URLSearchParams([
            ["v", CURRENT_VERSION],
            ["extent", "Deltid"],
            [SearchQueryParams.FROM, "25"],
        ]);
        const input = new URLSearchParams([
            ["v", CURRENT_VERSION],
            ["extent", "Deltid"],
            [SearchQueryParams.FROM, "25"],
        ]);
        const result = setDefaultParameters(input, { resetFrom: false });
        expect(result.toString()).toEqual(expected.toString());
    });
});
