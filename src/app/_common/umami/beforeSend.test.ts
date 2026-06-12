import { beforeEach, describe, expect, it } from "vitest";
import { BEFORE_SEND_FN_NAME, installNavBeforeSend } from "./beforeSend";

type BeforeSendFn = (type: string, payload: Record<string, unknown>) => Record<string, unknown>;

function getBeforeSend(): BeforeSendFn {
    installNavBeforeSend();
    return (window as unknown as Record<string, BeforeSendFn>)[BEFORE_SEND_FN_NAME];
}

const UUID = "217b2553-5eea-45a6-9873-87c50df7ceee";
const REDACTED = "[uuid]";

describe("navBeforeSend", () => {
    let beforeSend: BeforeSendFn;

    beforeEach(() => {
        beforeSend = getBeforeSend();
    });

    describe("stilling-URLer", () => {
        it("beholder UUID i /stillinger/stilling/[uuid]", () => {
            const url = `https://arbeidsplassen.nav.no/stillinger/stilling/${UUID}`;
            const result = beforeSend("pageview", { url });
            expect(result.url).toBe(url);
        });

        it("beholder UUID i relativ /stillinger/stilling/[uuid]", () => {
            const url = `/stillinger/stilling/${UUID}`;
            const result = beforeSend("pageview", { url });
            expect(result.url).toBe(url);
        });

        it("beholder UUID i /stillinger/trekk-soknad/[uuid]", () => {
            const url = `https://arbeidsplassen.nav.no/stillinger/trekk-soknad/${UUID}`;
            const result = beforeSend("pageview", { url });
            expect(result.url).toBe(url);
        });

        it("beholder UUID i /stillinger/rapporter-annonse/[uuid]", () => {
            const url = `https://arbeidsplassen.nav.no/stillinger/rapporter-annonse/${UUID}`;
            const result = beforeSend("pageview", { url });
            expect(result.url).toBe(url);
        });
    });

    describe("andre URLer — UUID skal redakteres", () => {
        it("redakterer UUID i /muligheter/mulighet/[uuid]", () => {
            const url = `https://arbeidsplassen.nav.no/muligheter/mulighet/${UUID}`;
            const result = beforeSend("pageview", { url });
            expect(result.url).toContain(REDACTED);
            expect(result.url).not.toContain(UUID);
        });

        it("beholder website-feltet urørt (Umami intern UUID)", () => {
            const result = beforeSend("event", { website: UUID, url: "/stillinger" });
            expect(result.website).toBe(UUID);
        });

        it("redakterer UUID i andre felter enn url", () => {
            const result = beforeSend("event", {
                url: "/stillinger",
                referrer: `https://example.com/foo/${UUID}/bar`,
            });
            expect(result.referrer).not.toContain(UUID);
            expect(result.referrer).toContain(REDACTED);
        });

        it("beholder ikke-UUID-strenger urørt", () => {
            const result = beforeSend("event", {
                url: "/stillinger",
                title: "Søk etter stillinger",
            });
            expect(result.title).toBe("Søk etter stillinger");
        });
    });

    describe("edge cases", () => {
        it("krasjer ikke på ugyldig URL-streng", () => {
            expect(() => beforeSend("pageview", { url: "ikke en url %%%" })).not.toThrow();
        });

        it("håndterer payload med nestede objekter", () => {
            const result = beforeSend("event", {
                url: "/stillinger",
                data: { referrer: `https://example.com/${UUID}` },
            });
            const data = result.data as Record<string, string>;
            expect(data.referrer).not.toContain(UUID);
        });

        it("håndterer payload med arrays", () => {
            const result = beforeSend("event", {
                url: "/stillinger",
                tags: [`tag-${UUID}`, "plain-tag"],
            });
            const tags = result.tags as string[];
            expect(tags[0]).not.toContain(UUID);
            expect(tags[1]).toBe("plain-tag");
        });
    });
});
