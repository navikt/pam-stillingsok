import { describe, expect, it } from "vitest";
import { hasForbiddenUrlCharacters, isSafeContentHref, isSafeRelativeHref, isSafeVimeoHref } from "./urlSafety";

describe("isSafeVimeoHref", () => {
    it("godtar vimeo.com med numerisk ID", () => {
        expect(isSafeVimeoHref("https://vimeo.com/1180806925")).toBe(true);
    });

    it("godtar player.vimeo.com/video/{id}", () => {
        expect(isSafeVimeoHref("https://player.vimeo.com/video/1180806925")).toBe(true);
    });

    it("godtar staging-fixturens tomme spørsmålstegn", () => {
        // Query er tom streng her, ikke en reell query-parameter.
        expect(isSafeVimeoHref("https://player.vimeo.com/video/1180806925?")).toBe(true);
    });

    it("avviser http", () => {
        expect(isSafeVimeoHref("http://vimeo.com/1180806925")).toBe(false);
    });

    it("avviser credentials i URL-en", () => {
        expect(isSafeVimeoHref("https://user:pass@vimeo.com/1180806925")).toBe(false);
    });

    it("avviser port", () => {
        expect(isSafeVimeoHref("https://vimeo.com:8443/1180806925")).toBe(false);
    });

    it("avviser query-parametre", () => {
        expect(isSafeVimeoHref("https://vimeo.com/1180806925?h=abc123")).toBe(false);
    });

    it("avviser fragment", () => {
        expect(isSafeVimeoHref("https://vimeo.com/1180806925#t=10s")).toBe(false);
    });

    it("avviser lookalike-host", () => {
        expect(isSafeVimeoHref("https://vimeo.com.evil.example/1180806925")).toBe(false);
    });

    it("avviser ikke-numerisk ID", () => {
        expect(isSafeVimeoHref("https://vimeo.com/abc123")).toBe(false);
    });

    it("avviser ekstra path-segmenter", () => {
        expect(isSafeVimeoHref("https://vimeo.com/1180806925/extra")).toBe(false);
    });

    it("avviser ugyldig URL", () => {
        expect(isSafeVimeoHref("ikke-en-url")).toBe(false);
    });
});

describe("isSafeContentHref", () => {
    it("godtar trygg relativ lenke", () => {
        expect(isSafeContentHref("/ung/artikler/noe")).toBe(true);
    });

    it("godtar https-lenke uten credentials", () => {
        expect(isSafeContentHref("https://example.no/sti")).toBe(true);
    });

    it("avviser credentials i https-lenke", () => {
        expect(isSafeContentHref("https://user:pass@example.no")).toBe(false);
    });
});

describe("isSafeRelativeHref", () => {
    it("avviser protocol-relative lenke", () => {
        expect(isSafeRelativeHref("//evil.example")).toBe(false);
    });
});

describe("hasForbiddenUrlCharacters", () => {
    it("oppdager kontrolltegn", () => {
        expect(hasForbiddenUrlCharacters("https://vimeo.com/1\u0000")).toBe(true);
    });
});
