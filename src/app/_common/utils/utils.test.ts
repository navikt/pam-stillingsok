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

    test("should return false for invalid URL format", () => {
        expect(isValidUrl("not-a-valid-url")).toBe(false);
    });

    test("should return false for invalid URL format double '..'", () => {
        expect(isValidUrl("http://arbeidsplassen..com")).toBe(false);
    });

    test("should return false for empty string", () => {
        expect(isValidUrl("")).toBe(false);
    });
});
