import { describe, expect, it } from "vitest";
import { getDate, getWorktime } from "@/app/stilling/_data/utils";

describe("Worktime parser", () => {
    it("can parse one element strings", () => {
        const parsedString = getWorktime("Ukedager");
        expect(parsedString).toEqual("Ukedager");
    });

    it("can parse multi element strings", () => {
        const parsedString = getWorktime("Ukedager Søndag");
        expect(parsedString).toEqual("Ukedager Søndag");
    });

    it("can parse single element arrays", () => {
        const parsedString = getWorktime('["Ukedager"]');
        expect(parsedString).toEqual("Ukedager");
    });

    it("can parse multiple element arrays", () => {
        const parsedString = getWorktime('["Ukedager","Søndag"]');
        expect(parsedString).toEqual("Ukedager, Søndag");
    });

    it("does not accept objects", () => {
        const parsedString = getWorktime('{ "type": "date" }');
        expect(parsedString).toEqual("");
    });

    it("does not accept objects in arrays", () => {
        const parsedString = getWorktime('[{ "type": "date" }]');
        expect(parsedString).toEqual("");
    });

    it("does not accept arrays in arrays", () => {
        const parsedString = getWorktime('[["Ukedager"]]');
        expect(parsedString).toEqual("");
    });

    it("does not accept strings and objects mixed in arrays", () => {
        const parsedString = getWorktime('["Ukedager", { "type": "date" }]');
        expect(parsedString).toEqual("Ukedager");
    });
});

describe("getDate", () => {
    it("should return a Date object for valid ISO string", () => {
        const dateString = "2023-10-07T12:34:56.000Z";
        const result = getDate(dateString);
        expect(result).toBeInstanceOf(Date);
        expect(result?.toISOString()).toBe(dateString);
    });

    it("should return undefined for invalid date string", () => {
        const invalidString = "invalid-date-string";
        const result = getDate(invalidString);
        expect(result).toBeUndefined();
    });

    it("should return undefined for non-string input", () => {
        const nonStringInput = 12345;
        const result = getDate(nonStringInput);
        expect(result).toBeUndefined();
    });

    it("should return undefined for null input", () => {
        const result = getDate(null);
        expect(result).toBeUndefined();
    });

    it("should return undefined for undefined input", () => {
        const result = getDate(undefined);
        expect(result).toBeUndefined();
    });
});
