import { describe, expect, test } from "vitest";
import searchParamsToURLSearchParams from "@/app/(sok)/_utils/searchParamsToURLSearchParams";

describe("searchParamsToURLSearchParams", () => {
    test("Should parse properties with a single value into key/value pair", () => {
        const result = searchParamsToURLSearchParams({
            test: "a",
        });
        expect(result.toString()).toEqual("test=a");
    });

    test("Should parse properties that holds an array into separate key/value pairs", () => {
        const result = searchParamsToURLSearchParams({
            test: ["a", "b"],
        });
        expect(result.toString()).toEqual("test=a&test=b");
    });
});
