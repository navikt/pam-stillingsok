import { describe, expect, test } from "vitest";
import {
    formatWorkdaysString,
    formatWorkTimeString,
    joinArbeidstider,
} from "@/app/stilling/[id]/_components/joinArbeidstider";

const arbeidsdager = "Ukedager, Søndag, Lørdag";

describe("test formatWorkdaysString", () => {
    test("should return Alle dager when all options are chosen", () => {
        expect(formatWorkdaysString(arbeidsdager)).equal("Alle dager");
    });
    test("should return the chosen days", () => {
        expect(formatWorkdaysString("Ukedager, Søndag")).equal("Ukedager og søndag");
    });
    test("should return null if workdays is empty", () => {
        expect(formatWorkdaysString(undefined)).equal(null);
        expect(formatWorkdaysString(null)).equal(null);
    });
});

describe("test formatWorkTimeString", () => {
    test("should return the chosen days", () => {
        expect(formatWorkTimeString("Natt, Dagtid")).equal("Natt og dagtid");
    });
    test("should return null if worktime is empty", () => {
        expect(formatWorkTimeString(undefined)).equal(null);
        expect(formatWorkTimeString(null)).equal(null);
    });
});

describe("test joinArbeidstider", () => {
    test("should return formatted string", () => {
        expect(joinArbeidstider("Skift", "Natt", "Ukedager")).equal("Skift, natt, ukedager");
    });
    test("should return formatted string when a value is null or undefined", () => {
        expect(joinArbeidstider(null, "Natt", "Ukedager")).equal("Natt, ukedager");
        expect(joinArbeidstider("Skift", undefined, "Ukedager")).equal("Skift, ukedager");
    });
    test("should return string with formatted worktime", () => {
        expect(joinArbeidstider("Skift", "Dagtid, Natt, Kveld", arbeidsdager)).equal(
            "Skift, dagtid, natt og kveld, alle dager",
        );
    });
});
