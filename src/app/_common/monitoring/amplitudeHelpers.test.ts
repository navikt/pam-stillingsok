import { describe, expect, test } from "vitest";
import { FilterEventData, FilterSource, formatFilterEventData } from "@/app/_common/monitoring/amplitudeHelpers";

describe("test formatFilterEventData", () => {
    test("good data, no formatting/conversion needed", () => {
        const input: FilterEventData = {
            name: "Publisert",
            value: "Nye siste 3 døgn",
            checked: true,
        };

        const output = formatFilterEventData(input);

        const expected: FilterEventData = {
            ...input,
            source: FilterSource.SIDEBAR,
        };
        expect(output).toStrictEqual(expected);
    });

    test("good data, formatting/conversion needed", () => {
        const input: FilterEventData = {
            name: "published",
            value: "now-3d",
            checked: true,
            source: FilterSource.SEARCHBOX,
        };

        const output = formatFilterEventData({ ...input });

        const expected: FilterEventData = {
            name: "Publisert",
            value: "Nye siste 3 døgn",
            checked: true,
            source: FilterSource.SEARCHBOX,
        };
        expect(output).toStrictEqual(expected);
        expect(output).not.toStrictEqual(input);
    });
});
