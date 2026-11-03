import { describe, expect, it } from "vitest";
import { buildSelectedOptions } from "./buildSelectedOptions";

describe("buildSelectedOptions", () => {
    it("viser Julejobb når verdien er true", () => {
        const options = buildSelectedOptions(new URLSearchParams("isXmasJob=true"));

        expect(options).toContainEqual({
            label: "Julejobb",
            value: "isXmasJob-true",
            queryKey: "isXmasJob",
            queryValue: "true",
        });
    });

    it.each(["false", "", "ukjent"])("ignorerer Julejobb når verdien er %j", (value) => {
        const options = buildSelectedOptions(new URLSearchParams(`isXmasJob=${value}`));

        expect(options.some((option) => option.label === "Julejobb")).toBe(false);
    });
});
