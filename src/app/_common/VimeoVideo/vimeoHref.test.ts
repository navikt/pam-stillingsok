import { describe, expect, it } from "vitest";
import { parseVimeoHref } from "@/app/_common/VimeoVideo/vimeoHref";

describe("parseVimeoHref", () => {
    it("parser en vimeo.com-lenke", () => {
        const parsed = parseVimeoHref("https://vimeo.com/1180806925");
        expect(parsed).toEqual({
            videoId: "1180806925",
            embedSrc: "https://player.vimeo.com/video/1180806925?dnt=1&autoplay=1",
        });
    });

    it("parser en player.vimeo.com-lenke, inkludert staging-fixturens tomme spørsmålstegn", () => {
        const parsed = parseVimeoHref("https://player.vimeo.com/video/1180806925?");
        expect(parsed).toEqual({
            videoId: "1180806925",
            embedSrc: "https://player.vimeo.com/video/1180806925?dnt=1&autoplay=1",
        });
    });

    it("avviser ikke-numerisk ID", () => {
        expect(parseVimeoHref("https://vimeo.com/abc123")).toBeNull();
    });

    it("avviser ukjent host", () => {
        expect(parseVimeoHref("https://evil.example/video/1180806925")).toBeNull();
    });

    it("avviser ugyldig URL", () => {
        expect(parseVimeoHref("ikke-en-url")).toBeNull();
    });

    it("avviser ekstra path-segmenter", () => {
        expect(parseVimeoHref("https://vimeo.com/1180806925/extra")).toBeNull();
    });
});
