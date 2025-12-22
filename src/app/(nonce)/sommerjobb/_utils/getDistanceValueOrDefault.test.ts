import { describe, expect, test } from "vitest";
import { getDistanceValueOrDefault } from "@/app/(nonce)/sommerjobb/_utils/getDistanceValueOrDefault";
import { DEFAULT_DISTANCE } from "@/app/(nonce)/sommerjobb/_utils/constants";

describe("getDistanceValueOrDefault", () => {
    test("Should return distance as string", () => {
        const result = getDistanceValueOrDefault("10");
        expect(result).toEqual("10");
    });

    test("Should return default distance if provided value is invalid", () => {
        const result = getDistanceValueOrDefault("abc");
        expect(result).toEqual(DEFAULT_DISTANCE.toString());
    });

    test("Should return default distance if provided value is not allowed", () => {
        const result = getDistanceValueOrDefault("999");
        expect(result).toEqual(DEFAULT_DISTANCE.toString());
    });

    test("Should return default distance if provided value is null", () => {
        const result = getDistanceValueOrDefault(null);
        expect(result).toEqual(DEFAULT_DISTANCE.toString());
    });

    test("Should return default distance if provided value is undefined", () => {
        const result = getDistanceValueOrDefault(undefined);
        expect(result).toEqual(DEFAULT_DISTANCE.toString());
    });
});
