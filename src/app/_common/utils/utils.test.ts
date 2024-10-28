import { isValidUrl } from "@/app/_common/utils/utilsts";

describe("isValidUrl", () => {
    test("should return true for valid URL with http protocol", () => {
        expect(isValidUrl("http://arbeidsplassen.no")).toBe(true);
    });

    test("should return true for valid URL with https protocol", () => {
        expect(isValidUrl("https://arbeidsplassen.no")).toBe(true);
    });

    test("should return true for valid URL without protocol", () => {
        expect(isValidUrl("http://arbeidsplassen.no")).toBe(true);
    });

    test("should return true for ref url", () => {
        expect(
            isValidUrl(
                "https://fus.no/ledige-stillinger/sok-her?rmpage=apply&rmjob=2897&ref=https://www.finn.no&utm_medium=talentech_publishing&utm_source=finn",
            ),
        ).toBe(true);
    });

    test("should return false for invalid URL format", () => {
        expect(isValidUrl("not-a-valid-url")).toBe(false);
    });

    test("should return false for text with spaces", () => {
        expect(isValidUrl("https://Bedrift bedriftesen AS 49483728")).toBe(false);
    });
    test("should return false for empty string", () => {
        expect(isValidUrl("")).toBe(false);
    });
});
