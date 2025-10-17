import { describe, it, expect } from "vitest";
import { parseStrictBoolean } from "@/app/stillinger/_common/lib/ad-model/transform/normalizers";

describe("normalizers", () => {
    it("parseStrictBoolean", () => {
        expect(parseStrictBoolean("true")).toBe(true);
        expect(parseStrictBoolean("false")).toBe(false);
        expect(parseStrictBoolean("yes")).toBeNull();
    });
});
