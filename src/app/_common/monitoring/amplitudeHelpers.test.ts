import { describe, expect, test } from "vitest";
import { FilterEventData, FilterSource, formatFilterEventData } from "@/app/_common/monitoring/amplitudeHelpers";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

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

    test("good data (published), formatting/conversion needed", () => {
        const input: FilterEventData = {
            name: QueryNames.PUBLISHED,
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

    test("good data (county), formatting/conversion needed", () => {
        const input: FilterEventData = {
            name: QueryNames.MUNICIPAL,
            value: "AKERSHUS.LILLESTRØM",
            checked: true,
        };

        const output = formatFilterEventData({ ...input });

        const expected: FilterEventData = {
            name: "Sted",
            level: "Kommune",
            value: "Lillestrøm",
            checked: true,
            source: FilterSource.SIDEBAR,
        };
        expect(output).toStrictEqual(expected);
        expect(output).not.toStrictEqual(input);
    });

    test("good data (occupationLevel2), formatting/conversion needed", () => {
        const input: FilterEventData = {
            name: QueryNames.OCCUPATION_SECOND_LEVEL,
            value: "IT.Utvikling",
            checked: true,
            source: FilterSource.SEARCHBOX,
        };

        const output = formatFilterEventData({ ...input });

        const expected: FilterEventData = {
            name: "Yrkeskategori",
            level: "Yrkesnivå 2",
            value: "Utvikling",
            checked: true,
            source: FilterSource.SEARCHBOX,
        };
        expect(output).toStrictEqual(expected);
        expect(output).not.toStrictEqual(input);
    });
});
