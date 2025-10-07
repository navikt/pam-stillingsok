import { describe, it, expect, test } from "vitest";
import { formatWorkdaysString, formatWorkTimeString, joinArbeidstider } from "../index";

const arbeidsdager = ["Ukedager", "Søndag", "Lørdag"];

describe("formatWorkdaysString", () => {
    it("returnerer 'Alle dager' når alle tre er representert", () => {
        expect(formatWorkdaysString(["Søndag", "Ukedager", "Lørdag"])).toBe("Alle dager");
    });

    it("normaliserer diakritikk og case", () => {
        expect(formatWorkdaysString(["sondag", "LØRDAG", "ukedager"])).toBe("Alle dager");
    });

    it("beholder ukjente verdier på slutten", () => {
        expect(formatWorkdaysString(["Ukedager", "Banansøndag"])).toBe("Ukedager og banansøndag");
    });
    test("should return null if workdays is empty", () => {
        expect(formatWorkdaysString(undefined)).equal(null);
        expect(formatWorkdaysString(null)).equal(null);
    });
});

describe("formatWorkTimeString", () => {
    it("lowercase unntatt første", () => {
        expect(formatWorkTimeString(["Dag", "Kveld", "Natt"])).toBe("Dag, kveld og natt");
    });

    it("kan settes til all lowercase", () => {
        expect(formatWorkTimeString(["Dag", "Kveld"], { lowercaseMode: "all" })).toBe("dag og kveld");
    });
});

describe("joinArbeidstider", () => {
    it("inkluderer jobArrangement og tid/dager", () => {
        const s = joinArbeidstider("Hjemmekontor", ["Dag", "Kveld"], ["Ukedager"]);
        expect(s).toBe("Hjemmekontor, dag og kveld, ukedager");
    });

    it("kapitaliserer første når jobArrangement mangler", () => {
        const s = joinArbeidstider(null, ["dag", "kveld"], ["lørdag"]);
        expect(s).toBe("Dag og kveld, lørdag");
    });

    test("should return formatted string when a value is null or undefined", () => {
        expect(joinArbeidstider(null, ["Natt"], ["Ukedager"])).equal("Natt, ukedager");
        expect(joinArbeidstider("Skift", undefined, ["Ukedager"])).equal("Skift, ukedager");
    });
    test("should return string with formatted worktime", () => {
        expect(joinArbeidstider("Skift", ["Dagtid", "Natt", "Kveld"], arbeidsdager)).equal(
            "Skift, dagtid, natt og kveld, alle dager",
        );
    });
    test("should start string with uppercase if jobArrangement is missing", () => {
        expect(joinArbeidstider(null, ["Dagtid", "Natt", "Kveld"], arbeidsdager)).equal(
            "Dagtid, natt og kveld, alle dager",
        );
    });
});
