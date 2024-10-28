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
    test("should return true for localhost", () => {
        expect(
            isValidUrl(
                "http://localhost:3000/27207/?utm_id=3179&utm_campaign=3179&utm_medium=job_share&utm_source=nav&utm_term=finn-test-2&utm_content=27207",
            ),
        ).toBe(true);
    });
});
