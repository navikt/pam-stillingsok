import { describe, expect, it } from "vitest";
import { toUrlSearchParams } from "@/app/_common/searchParams/searchParams";

describe("toUrlSearchParams", () => {
    it("beholder gjentatte parametre og utelater manglende verdier", () => {
        const result = toUrlSearchParams({
            svar: ["age-under-18", "goal-support"],
            v: "1",
            tom: undefined,
        });

        expect(result.getAll("svar")).toEqual(["age-under-18", "goal-support"]);
        expect(result.get("v")).toBe("1");
        expect(result.has("tom")).toBe(false);
    });
});
