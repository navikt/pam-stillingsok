import { describe, expect, it } from "vitest";
import { redactFreeText, stripFreeTextFromPageUrl, FREE_TEXT_PLACEHOLDER as X } from "./stripFreeTextFromPageUrl";

type Item = Parameters<typeof stripFreeTextFromPageUrl>[0];

const asItem = (value: unknown) => value as Item;

describe("redactFreeText", () => {
    it("erstatter alle q-verdier og beholder de andre parameterne", () => {
        expect(redactFreeText("https://arbeidsplassen.nav.no/stillinger?q=ønsker+å+jobbe+med+ki&v=6&q=deltid")).toBe(
            `https://arbeidsplassen.nav.no/stillinger?q=${X}&v=6&q=${X}`,
        );
    });

    it("beholder fragment", () => {
        expect(redactFreeText("/stillinger?q=kokk&county=OSLO#treff")).toBe(`/stillinger?q=${X}&county=OSLO#treff`);
    });

    it("erstatter prosentkodet parameternavn (%71 = q)", () => {
        expect(redactFreeText("/stillinger?%71=helseopplysning&v=6")).toBe(`/stillinger?%71=${X}&v=6`);
        expect(new URLSearchParams("%71=helseopplysning").get("q")).toBe("helseopplysning");
    });

    it("rører ikke parametere som bare ligner på q", () => {
        const url = "/stillinger?qs=1&Q=2&faq=3";
        expect(redactFreeText(url)).toBe(url);
    });

    it("finner URL-er inne i lengre tekst", () => {
        expect(redactFreeText("GET /stillinger?q=sykepleier+bergen&_rsc=abc failed")).toBe(
            `GET /stillinger?q=${X}&_rsc=abc failed`,
        );
    });
});

describe("stripFreeTextFromPageUrl", () => {
    it("renser meta.page.url", () => {
        const result = stripFreeTextFromPageUrl(
            asItem({ type: "event", payload: {}, meta: { page: { url: "/stillinger?q=kokk&v=6" } } }),
        );
        expect(result?.meta.page?.url).toBe(`/stillinger?q=${X}&v=6`);
    });

    it("renser fromUrl og toUrl i navigasjonshendelser", () => {
        const result = stripFreeTextFromPageUrl(
            asItem({
                type: "event",
                payload: {
                    name: "faro.navigation",
                    attributes: { fromUrl: "/stillinger?q=a", toUrl: "/stillinger?q=b&v=1" },
                },
                meta: {},
            }),
        );
        expect(result?.payload).toMatchObject({
            attributes: { fromUrl: `/stillinger?q=${X}`, toUrl: `/stillinger?q=${X}&v=1` },
        });
    });

    it("renser name i faro.performance.navigation", () => {
        const result = stripFreeTextFromPageUrl(
            asItem({
                type: "event",
                payload: {
                    name: "faro.performance.navigation",
                    attributes: { name: "https://arbeidsplassen.nav.no/stillinger?q=kokk" },
                },
                meta: {},
            }),
        );
        expect(result?.payload).toMatchObject({
            attributes: { name: `https://arbeidsplassen.nav.no/stillinger?q=${X}` },
        });
    });

    it("renser http.url i fetch-hendelser fra tracing", () => {
        const result = stripFreeTextFromPageUrl(
            asItem({
                type: "event",
                payload: { name: "faro.tracing.fetch", attributes: { "http.url": "/stillinger?q=kokk&_rsc=1" } },
                meta: {},
            }),
        );
        expect(result?.payload).toMatchObject({ attributes: { "http.url": `/stillinger?q=${X}&_rsc=1` } });
    });

    it("renser span-attributter dypt i OTLP trace-payload", () => {
        const item = asItem({
            type: "trace",
            payload: {
                resourceSpans: [
                    {
                        scopeSpans: [
                            {
                                spans: [
                                    {
                                        name: "HTTP GET",
                                        attributes: [{ key: "http.url", value: { stringValue: "/stillinger?q=kokk" } }],
                                    },
                                ],
                            },
                        ],
                    },
                ],
            },
            meta: {},
        });
        const result = stripFreeTextFromPageUrl(item);
        expect(JSON.stringify(result)).not.toContain("kokk");
        expect(JSON.stringify(result)).toContain(`/stillinger?q=${X}`);
    });

    it("renser alle forekomster når samme objekt brukes flere steder", () => {
        const shared = { url: "/stillinger?q=helseopplysning" };
        const result = stripFreeTextFromPageUrl(
            asItem({ type: "event", payload: { attributes: shared }, meta: { page: shared } }),
        );
        expect(JSON.stringify(result)).not.toContain("helseopplysning");
    });

    it("tåler sykliske objekter", () => {
        const cyclic: Record<string, unknown> = { url: "/stillinger?q=kokk" };
        cyclic.self = cyclic;
        const result = stripFreeTextFromPageUrl(asItem({ type: "event", payload: cyclic, meta: {} }));
        expect((result?.payload as { url?: string } | undefined)?.url).toBe(`/stillinger?q=${X}`);
    });

    it("returnerer samme item når ingenting skal fjernes", () => {
        const item = asItem({
            type: "event",
            payload: { attributes: { url: "/stillinger?v=6" } },
            meta: { page: { url: "/" } },
        });
        expect(stripFreeTextFromPageUrl(item)).toBe(item);
    });

    it("muterer ikke input-item", () => {
        const item = asItem({
            type: "event",
            payload: { attributes: { toUrl: "/stillinger?q=kokk" } },
            meta: { page: { url: "/stillinger?q=kokk" } },
        });
        const snapshot = structuredClone(item);
        stripFreeTextFromPageUrl(item);
        expect(item).toEqual(snapshot);
    });

    it("lar Error-instanser være urørt", () => {
        const originalError = new Error("feil");
        const result = stripFreeTextFromPageUrl(
            asItem({ type: "exception", payload: { value: "/stillinger?q=kokk", originalError }, meta: {} }),
        );
        expect((result?.payload as { originalError?: Error } | undefined)?.originalError).toBe(originalError);
    });
});
