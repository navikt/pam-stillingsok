import { describe, expect, it, vi } from "vitest";
import { createSharedContentClient } from "@/features/ung/onboarding/server/sharedContentClient.server";
import collectionFixture from "../../../../../docs/Enklere_vei_til_jobb/json_eksempler/collection.json";
import onItsOwnFixture from "../../../../../docs/Enklere_vei_til_jobb/json_eksempler/on_its_own.json";

const API_URL = "https://cms.staging.karriereveiledning.no";
const API_KEY = "test-key-123";
const ARTICLE_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";
const WEBFORM_ID = "fcb6a11e-5b6a-400a-a4dd-69bfc36b1f69";

function jsonResponse(body: unknown, contentType = "application/vnd.api+json"): Response {
    return new Response(JSON.stringify(body), { status: 200, headers: { "content-type": contentType } });
}

function createClient(fetchImplementation: typeof fetch) {
    const result = createSharedContentClient({ apiUrl: API_URL, apiKey: API_KEY }, fetchImplementation);
    if (!result.ok) {
        throw new Error("Forventet gyldig klientkonfigurasjon");
    }
    return result.data;
}

function collectionPage(ids: readonly string[], next?: string) {
    return {
        data: ids.map((id) => ({ type: "node--shared_content", id, attributes: { title: id } })),
        ...(next ? { links: { next: { href: next } } } : {}),
    };
}

describe("getCollection", () => {
    it("henter samlingen med api-key kun i header", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionFixture));

        const result = await createClient(fetchImplementation).getCollection();

        expect(result.ok && result.data.data).toHaveLength(4);
        const [requestUrl, init] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.origin).toBe(API_URL);
        expect(url.pathname).toBe("/jsonapi/node/shared_content");
        expect(String(requestUrl)).not.toContain(API_KEY);
        expect(url.searchParams.has("api-key")).toBe(false);
        expect(new Headers(init?.headers).get("api-key")).toBe(API_KEY);
        expect(init).toMatchObject({ cache: "no-store", redirect: "error" });
    });

    it("følger links.next på samme origin og path og slår sammen sidene", async () => {
        const next = `${API_URL}/jsonapi/node/shared_content?page%5Boffset%5D=1&page%5Blimit%5D=1`;
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockResolvedValueOnce(jsonResponse(collectionPage(["a"], next)))
            .mockResolvedValueOnce(jsonResponse(collectionPage(["b"])));

        const result = await createClient(fetchImplementation).getCollection();

        expect(result.ok && result.data.data.map((resource) => resource.id)).toEqual(["a", "b"]);
        expect(fetchImplementation).toHaveBeenCalledTimes(2);
        expect(String(fetchImplementation.mock.calls[1]?.[0])).toBe(next);
    });

    it.each([
        ["annen origin", "https://evil.example/jsonapi/node/shared_content?page=1"],
        ["annen path", `${API_URL}/jsonapi/node/other?page=1`],
        ["http i stedet for https", "http://cms.staging.karriereveiledning.no/jsonapi/node/shared_content?page=1"],
        ["api-key i query", `${API_URL}/jsonapi/node/shared_content?api-key=hemmelig`],
        ["credentials", "https://user:pw@cms.staging.karriereveiledning.no/jsonapi/node/shared_content?page=1"],
    ])("avviser neste-lenke med %s uten å kalle den", async (_name, next) => {
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse(collectionPage(["a"], next)));

        const result = await createClient(fetchImplementation).getCollection();

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
        expect(fetchImplementation).toHaveBeenCalledOnce();
    });

    it("oppdager løkke i paginering", async () => {
        const loop = `${API_URL}/jsonapi/node/shared_content?page%5Boffset%5D=1`;
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"], loop)));

        const result = await createClient(fetchImplementation).getCollection();

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
        expect(fetchImplementation).toHaveBeenCalledTimes(2);
    });

    it("stopper ved maks antall sider", async () => {
        let call = 0;
        const fetchImplementation = vi.fn<typeof fetch>().mockImplementation(async () => {
            call++;
            return jsonResponse(
                collectionPage([`id-${call}`], `${API_URL}/jsonapi/node/shared_content?page%5Boffset%5D=${call}`),
            );
        });

        const result = await createClient(fetchImplementation).getCollection();

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
        expect(fetchImplementation.mock.calls.length).toBeLessThanOrEqual(5);
    });

    it("stopper ved for mange ressurser", async () => {
        const ids = Array.from({ length: 101 }, (_, index) => `id-${index}`);
        const fetchImplementation = vi.fn<typeof fetch>().mockResolvedValue(jsonResponse(collectionPage(ids)));

        const result = await createClient(fetchImplementation).getCollection();

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
    });
});

describe("getArticle", () => {
    it("henter artikkelen og validerer UUID før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockImplementation(async () => jsonResponse(onItsOwnFixture));
        const client = createClient(fetchImplementation);

        expect(await client.getArticle({ resourceId: "ikke-uuid", include: [] })).toMatchObject({
            ok: false,
            error: { type: "invalid-request" },
        });
        expect(fetchImplementation).not.toHaveBeenCalled();

        const result = await client.getArticle({ resourceId: ARTICLE_ID, include: ["field_sc_content"] });

        expect(result.ok).toBe(true);
        const [requestUrl, init] = fetchImplementation.mock.calls[0] ?? [];
        expect(String(requestUrl)).toBe(
            `${API_URL}/jsonapi/node/shared_content/${ARTICLE_ID}?include=field_sc_content`,
        );
        expect(new Headers(init?.headers).get("api-key")).toBe(API_KEY);
    });
});

describe("getWebform", () => {
    it("henter Webform med UUID og returnerer YAML", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockImplementation(async () =>
            jsonResponse({
                data: {
                    type: "webform--webform",
                    id: WEBFORM_ID,
                    attributes: { title: "Quiz", elements_combined: "q1:\n  '#type': quiz_element_radios" },
                },
            }),
        );
        const client = createClient(fetchImplementation);

        const result = await client.getWebform({ webformId: WEBFORM_ID });

        expect(result).toEqual({
            ok: true,
            data: { id: WEBFORM_ID, title: "Quiz", yaml: "q1:\n  '#type': quiz_element_radios" },
        });
        const [requestUrl, init] = fetchImplementation.mock.calls[0] ?? [];
        expect(new URL(String(requestUrl)).pathname).toBe(`/jsonapi/webform/webform/${WEBFORM_ID}`);
        expect(String(requestUrl)).not.toContain(API_KEY);
        expect(new Headers(init?.headers).get("api-key")).toBe(API_KEY);
    });

    it("avviser ugyldig UUID før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>();

        const result = await createClient(fetchImplementation).getWebform({ webformId: "../../user" });

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-request" } });
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("avviser svar uten elementer og feil content-type", async () => {
        const missing = vi
            .fn<typeof fetch>()
            .mockImplementation(async () =>
                jsonResponse({ data: { type: "webform--webform", id: WEBFORM_ID, attributes: { title: "Quiz" } } }),
            );
        expect(await createClient(missing).getWebform({ webformId: WEBFORM_ID })).toMatchObject({
            ok: false,
            error: { type: "invalid-contract" },
        });

        const html = vi.fn<typeof fetch>().mockImplementation(async () => jsonResponse({}, "text/html"));
        expect(await createClient(html).getWebform({ webformId: WEBFORM_ID })).toMatchObject({
            ok: false,
            error: { type: "invalid-response" },
        });
    });

    it("gir network-feil uten å lekke detaljer", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockRejectedValue(new Error(`feil mot ${API_KEY}`));

        const result = await createClient(fetchImplementation).getWebform({ webformId: WEBFORM_ID });

        expect(result).toEqual({
            ok: false,
            error: { type: "network", message: "Shared Content-kallet feilet før vi mottok et svar" },
        });
        expect(JSON.stringify(result)).not.toContain(API_KEY);
    });
});
