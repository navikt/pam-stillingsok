import { describe, expect, it } from "vitest";
import { retainSelectedCustomOptions } from "./searchComboboxFilterActions";

describe("retainSelectedCustomOptions", () => {
    it("fjerner fritekstvalg som ikke lenger er valgt", () => {
        const retainedOptions = retainSelectedCustomOptions(
            [
                { label: "Utvikler", value: "Utvikler" },
                { label: "Designer", value: "Designer" },
            ],
            [{ label: "Designer", value: "Designer" }],
        );

        expect(retainedOptions).toEqual([{ label: "Designer", value: "Designer" }]);
    });
});
