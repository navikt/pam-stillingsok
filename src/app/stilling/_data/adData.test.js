import { describe, expect, test } from "vitest";
import { getWorktime } from "./adData";

describe("Worktime parser", () => {
    test("can parse one element strings", () => {
        const parsedString = getWorktime("Ukedager");
        expect(parsedString).toEqual("Ukedager");
    });

    test("can parse multi element strings", () => {
        const parsedString = getWorktime("Ukedager Søndag");
        expect(parsedString).toEqual("Ukedager Søndag");
    });

    test("can parse single element arrays", () => {
        const parsedString = getWorktime('["Ukedager"]');
        expect(parsedString).toEqual("Ukedager");
    });

    test("can parse multiple element arrays", () => {
        const parsedString = getWorktime('["Ukedager","Søndag"]');
        expect(parsedString).toEqual("Ukedager, Søndag");
    });

    test("does not accept objects", () => {
        const parsedString = getWorktime('{ "type": "date" }');
        expect(parsedString).toEqual("");
    });

    test("does not accept objects in arrays", () => {
        const parsedString = getWorktime('[{ "type": "date" }]');
        expect(parsedString).toEqual("");
    });

    test("does not accept arrays in arrays", () => {
        const parsedString = getWorktime('[["Ukedager"]]');
        expect(parsedString).toEqual("");
    });

    test("does not accept strings and objects mixed in arrays", () => {
        const parsedString = getWorktime('["Ukedager", { "type": "date" }]');
        expect(parsedString).toEqual("Ukedager");
    });
});
