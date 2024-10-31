import { getUrl } from "./stillingSoekSchema";
import { describe, expect, it } from "vitest";

describe("getUrl", () => {
    it("should return dangerouslyInvalidUrl with plain tekst", () => {
        expect(getUrl("https://Bedrift bedriftesen AS 49483728")).toStrictEqual(undefined);
    });

    it("should return url object with valid url", () => {
        expect(getUrl("http://arbeidsplassen.no")).toStrictEqual("http://arbeidsplassen.no");
    });

    it("should return url with protocol if missing", () => {
        expect(getUrl("arbeidsplassen.no")).toStrictEqual("https://arbeidsplassen.no");
    });

    it("should return dangerouslyInvalidUrl for url containing javascript", () => {
        expect(getUrl("javascript:alert(document.domain)")).toStrictEqual(undefined);
    });
    it("should return false for invalid URL format", () => {
        expect(getUrl("not-a-valid-url")).toBe(undefined);
    });

    it("should throw an error for javascript url", () => {
        expect(getUrl("javascript:alert(1)")).toBe(undefined);
    });
});
