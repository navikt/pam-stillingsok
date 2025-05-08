import { describe, expect, it } from "vitest";
import capitalizeFirstLetter from "@/app/stillinger/_common/utils/capitalizeFirstLetter";

describe("capitalizeFirstLetter", () => {
    it("should capitalize first letter", () => {
        expect(capitalizeFirstLetter("apple")).toBe("Apple");
    });

    it("should keep letter case for all other letters", () => {
        expect(capitalizeFirstLetter("aPPLE")).toBe("APPLE");
    });

    it("should capitalize word with only 1 char", () => {
        expect(capitalizeFirstLetter("a")).toBe("A");
    });
});
