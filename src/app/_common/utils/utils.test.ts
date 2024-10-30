import { isValidUrl } from "@/app/_common/utils/utilsts";

describe("isValidUrl", () => {
    test("should return true for valid URL with http protocol", () => {
        expect(isValidUrl("http://arbeidsplassen.no")).toBe(true);
    });

    test("should return true for valid URL with https protocol", () => {
        expect(isValidUrl("https://arbeidsplassen.no")).toBe(true);
    });

    test("should return true for valid URL without protocol", () => {
        expect(isValidUrl("arbeidsplassen.no")).toBe(true);
    });

    test("should return true for ref url", () => {
        expect(
            isValidUrl("https://fus.no/ledige-stillinger/sok-her?rmpage=apply&rmjob=2897&ref=https://www.finn.no"),
        ).toBe(true);
    });

    test("should return false for invalid URL format", () => {
        expect(isValidUrl("not-a-valid-url")).toBe(false);
    });

    test("should throw an error for javascript url", () => {
        expect(isValidUrl("javascript:alert(1)")).toBe(false);
    });

    test("should throw an error for data url", () => {
        expect(isValidUrl("data:text/html;base64,YWxlcnQoMSk=")).toBe(false);
    });

    test("should throw an error for url with script tags", () => {
        expect(isValidUrl('http://testsite.test/<script>alert("TEST");</script>')).toBe(false);
    });

    test("should throw an error for url with encoded script tags", () => {
        expect(isValidUrl("http://testsite.test/%3cscript%3ealert('TEST')%3c/script%3e")).toBe(false);
    });

    test("should return false for text with spaces", () => {
        expect(isValidUrl("https://Bedrift bedriftesen AS 49483728")).toBe(false);
    });

    test("should return false for empty string", () => {
        expect(isValidUrl("")).toBe(false);
    });

    test("should return true for localhost", () => {
        expect(isValidUrl("http://localhost:3000/stillinger/")).toBe(true);
    });
});
