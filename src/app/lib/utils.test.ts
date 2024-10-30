import { getUrl } from "./stillingSoekSchema";

describe("getUrl", () => {
    test("should return dangerouslyInvalidUrl with plain tekst", () => {
        expect(getUrl("https://Bedrift bedriftesen AS 49483728")).toStrictEqual(undefined);
    });

    test("should return url object with valid url", () => {
        expect(getUrl("http://arbeidsplassen.no")).toStrictEqual({ url: "http://arbeidsplassen.no" });
    });

    test("should return url with protocol if missing", () => {
        expect(getUrl("arbeidsplassen.no")).toStrictEqual({ url: "https://arbeidsplassen.no" });
    });

    test("should return dangerouslyInvalidUrl for url containing javascript", () => {
        expect(getUrl("javascript:alert(document.domain)")).toStrictEqual(undefined);
    });
    test("should return false for invalid URL format", () => {
        expect(getUrl("not-a-valid-url")).toBe(undefined);
    });

    test("should throw an error for javascript url", () => {
        expect(getUrl("javascript:alert(1)")).toBe(undefined);
    });
});
