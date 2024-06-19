import { describe, expect, test } from "vitest";
import { CURRENT_VERSION } from "@/app/(sok)/_utils/searchParamsVersioning";
import { setDefaultParams } from "@/app/(sok)/_utils/useSearchRouter";

describe("useSearchRouter", () => {
    test("Should prepend versioning parameter", () => {
        const expected = new URLSearchParams([
            ["v", CURRENT_VERSION],
            ["foo", "bar"],
        ]);
        const input = new URLSearchParams([["foo", "bar"]]);
        const result = setDefaultParams(input);
        expect(result.toString()).toEqual(expected.toString());
    });

    test("Should skip versioning parameter if no other params", () => {
        const expected = new URLSearchParams();
        const input = new URLSearchParams();
        const result = setDefaultParams(input);
        expect(result.toString()).toEqual(expected.toString());
    });
});
