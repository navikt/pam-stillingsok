import { describe, expect, it, vi } from "vitest";
import { appLogger } from "@/app/_common/logging/appLogger";
import { createSharedContentClient } from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import collectionFixture from "./__fixtures__/collection.json";
import onItsOwnFixture from "./__fixtures__/on_its_own.json";

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

function collectionPage(ids: readonly string[], next?: string, count?: number) {
    return {
        data: ids.map((id) => ({ type: "node--shared_content", id, attributes: { title: id } })),
        ...(next ? { links: { next: { href: next } } } : {}),
        ...(count === undefined ? {} : { meta: { count } }),
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

    it("sender ett filter som IN-betingelse", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"])));
        const ageId = "7d074491-7231-4c1c-aef3-bdd917776198";

        await createClient(fetchImplementation).getCollection({ age: [ageId] });

        const [requestUrl] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.searchParams.get("filter[age-group][condition][path]")).toBe("field_sc_age.id");
        expect(url.searchParams.get("filter[age-group][condition][operator]")).toBe("IN");
        expect(url.searchParams.getAll("filter[age-group][condition][value][]")).toEqual([ageId]);
    });

    it("sender flere verdier i IN-betingelsen for samme dimensjon", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"])));
        const goalA = "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2";
        const goalB = "cb90945e-a2c4-4a50-8dcb-438c1fe69764";

        await createClient(fetchImplementation).getCollection({ audiences: [goalA, goalB] });

        const [requestUrl] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.searchParams.getAll("filter[audiences-group][condition][value][]")).toEqual([goalA, goalB]);
    });

    it("kombinerer alle tre dimensjonene med egne filtergrupper", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"])));
        const ageId = "7d074491-7231-4c1c-aef3-bdd917776198";
        const experienceId = "a2dc822c-1eea-4201-bf2e-bcd61077ca05";
        const goalId = "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2";

        await createClient(fetchImplementation).getCollection({
            age: [ageId],
            experience: [experienceId],
            audiences: [goalId],
        });

        const [requestUrl] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.searchParams.get("filter[age-group][condition][path]")).toBe("field_sc_age.id");
        expect(url.searchParams.get("filter[experience-group][condition][path]")).toBe("field_sc_experience.id");
        expect(url.searchParams.get("filter[audiences-group][condition][path]")).toBe("field_sc_audiences.id");
    });

    it("sender ingen filter når ingen valg er gjort", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"])));

        await createClient(fetchImplementation).getCollection({});

        const [requestUrl] = fetchImplementation.mock.calls[0] ?? [];
        expect([...new URL(String(requestUrl)).searchParams.keys()].some((key) => key.startsWith("filter["))).toBe(
            false,
        );
    });

    it("avviser filterverdier som ikke er UUID-er før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>();

        const result = await createClient(fetchImplementation).getCollection({ age: ["ikke-en-uuid"] });

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-request" } });
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("url-enkoder verdiene riktig", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"])));
        const ageId = "7d074491-7231-4c1c-aef3-bdd917776198";

        await createClient(fetchImplementation).getCollection({ age: [ageId] });

        const [requestUrl] = fetchImplementation.mock.calls[0] ?? [];
        expect(String(requestUrl)).toContain("filter%5Bage-group%5D%5Bcondition%5D%5Bvalue%5D%5B%5D=" + ageId);
    });

    it("logger avvik mellom meta.count og antall mottatte artikler, uten å vise det i UI-et", async () => {
        const warnSpy = vi.spyOn(appLogger, "warn").mockImplementation(() => {});
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(collectionPage(["a"], undefined, 4)));

        const result = await createClient(fetchImplementation).getCollection();

        expect(result.ok && result.data.data).toHaveLength(1);
        expect(warnSpy).toHaveBeenCalledWith(
            expect.stringContaining("meta.count"),
            expect.objectContaining({ expectedCount: 4, receivedCount: 1 }),
        );
        warnSpy.mockRestore();
    });
});

describe("getArticle", () => {
    it("henter artikkelen og validerer UUID før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockImplementation(async () => jsonResponse(onItsOwnFixture));
        const client = createClient(fetchImplementation);

        expect(await client.getArticle("ikke-uuid")).toMatchObject({
            ok: false,
            error: { type: "invalid-request" },
        });
        expect(fetchImplementation).not.toHaveBeenCalled();

        const result = await client.getArticle(ARTICLE_ID);

        expect(result.ok).toBe(true);
        const [requestUrl, init] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.pathname).toBe(`/jsonapi/node/shared_content/${ARTICLE_ID}`);
        expect(url.searchParams.get("include")?.split(",")).toContain("field_sc_content");
        expect(new Headers(init?.headers).get("api-key")).toBe(API_KEY);
    });
});

describe("getWebformYaml", () => {
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

        const result = await client.getWebformYaml(WEBFORM_ID);

        expect(result).toEqual({ ok: true, data: "q1:\n  '#type': quiz_element_radios" });
        const [requestUrl, init] = fetchImplementation.mock.calls[0] ?? [];
        expect(new URL(String(requestUrl)).pathname).toBe(`/jsonapi/webform/webform/${WEBFORM_ID}`);
        expect(String(requestUrl)).not.toContain(API_KEY);
        expect(new Headers(init?.headers).get("api-key")).toBe(API_KEY);
    });

    it("avviser ugyldig UUID før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>();

        const result = await createClient(fetchImplementation).getWebformYaml("../../user");

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-request" } });
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("avviser svar uten elementer og feil content-type", async () => {
        const missing = vi
            .fn<typeof fetch>()
            .mockImplementation(async () =>
                jsonResponse({ data: { type: "webform--webform", id: WEBFORM_ID, attributes: { title: "Quiz" } } }),
            );
        expect(await createClient(missing).getWebformYaml(WEBFORM_ID)).toMatchObject({
            ok: false,
            error: { type: "invalid-contract" },
        });

        const html = vi.fn<typeof fetch>().mockImplementation(async () => jsonResponse({}, "text/html"));
        expect(await createClient(html).getWebformYaml(WEBFORM_ID)).toMatchObject({
            ok: false,
            error: { type: "invalid-response" },
        });
    });

    it("gir network-feil uten å lekke detaljer", async () => {
        const fetchImplementation = vi.fn<typeof fetch>().mockRejectedValue(new Error(`feil mot ${API_KEY}`));

        const result = await createClient(fetchImplementation).getWebformYaml(WEBFORM_ID);

        expect(result).toEqual({
            ok: false,
            error: { type: "network", message: "Shared Content-kallet feilet før vi mottok et svar" },
        });
        expect(JSON.stringify(result)).not.toContain(API_KEY);
    });
});

describe("getTaxonomyTerms", () => {
    const PARENT_ID = "813d0e38-b09b-4362-bd0c-6b978cc16ecb";
    const TERM_A = "5be5c5a4-c191-4f00-9ad1-cc4ac365da78";
    const TERM_B = "7d074491-7231-4c1c-aef3-bdd917776198";

    function taxonomyPage(terms: readonly { id: string; name: string; weight: number }[], next?: string) {
        return {
            data: terms.map((term) => ({
                type: "taxonomy_term--shared_content_age",
                id: term.id,
                attributes: { name: term.name, weight: term.weight },
            })),
            ...(next ? { links: { next: { href: next } } } : {}),
        };
    }

    it("bygger URL med fields, sort og page[limit], og bruker revalidate i stedet for no-store", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () =>
                jsonResponse(taxonomyPage([{ id: TERM_B, name: "18 år eller eldre", weight: 1 }])),
            );

        const result = await createClient(fetchImplementation).getTaxonomyTerms("shared_content_age");

        expect(result).toEqual({ ok: true, data: [{ id: TERM_B, name: "18 år eller eldre", weight: 1 }] });
        const [requestUrl, init] = fetchImplementation.mock.calls[0] ?? [];
        const url = new URL(String(requestUrl));
        expect(url.pathname).toBe("/jsonapi/taxonomy_term/shared_content_age");
        expect(url.searchParams.get("fields[taxonomy_term--shared_content_age]")).toBe("name,weight");
        expect(url.searchParams.get("sort")).toBe("weight");
        expect(url.searchParams.get("page[limit]")).toBe("50");
        expect(url.searchParams.has("filter[parent.id]")).toBe(false);
        expect(init).toMatchObject({ next: { revalidate: 3600 }, redirect: "error" });
        expect(init?.cache).toBeUndefined();
    });

    it("legger på filter[parent.id] når parentId er gyldig UUID", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(taxonomyPage([])));

        await createClient(fetchImplementation).getTaxonomyTerms("situations", { parentId: PARENT_ID });

        const [requestUrl] = fetchImplementation.mock.calls[0] ?? [];
        expect(new URL(String(requestUrl)).searchParams.get("filter[parent.id]")).toBe(PARENT_ID);
    });

    it("avviser ugyldig parentId før fetch", async () => {
        const fetchImplementation = vi.fn<typeof fetch>();

        const result = await createClient(fetchImplementation).getTaxonomyTerms("situations", {
            parentId: "ikke-en-uuid",
        });

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-request" } });
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("gir tom liste når vokabularet er tomt", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse(taxonomyPage([])));

        const result = await createClient(fetchImplementation).getTaxonomyTerms("shared_content_experience");

        expect(result).toEqual({ ok: true, data: [] });
    });

    it("avviser svar som ikke følger kontrakten", async () => {
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockImplementation(async () => jsonResponse({ data: [{ type: "x", id: TERM_A, attributes: {} }] }));

        const result = await createClient(fetchImplementation).getTaxonomyTerms("shared_content_age");

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-contract" } });
    });

    it("følger links.next på samme origin og path og slår sammen sidene", async () => {
        const next = `${API_URL}/jsonapi/taxonomy_term/shared_content_age?page%5Boffset%5D=1`;
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockResolvedValueOnce(jsonResponse(taxonomyPage([{ id: TERM_A, name: "Under 18 år", weight: 0 }], next)))
            .mockResolvedValueOnce(jsonResponse(taxonomyPage([{ id: TERM_B, name: "18 år eller eldre", weight: 1 }])));

        const result = await createClient(fetchImplementation).getTaxonomyTerms("shared_content_age");

        expect(result.ok && result.data.map((term) => term.id)).toEqual([TERM_A, TERM_B]);
        expect(fetchImplementation).toHaveBeenCalledTimes(2);
    });

    it("avviser neste-lenke med annen path uten å kalle den", async () => {
        const next = `${API_URL}/jsonapi/taxonomy_term/shared_content_experience?page=1`;
        const fetchImplementation = vi
            .fn<typeof fetch>()
            .mockResolvedValue(jsonResponse(taxonomyPage([{ id: TERM_A, name: "A", weight: 0 }], next)));

        const result = await createClient(fetchImplementation).getTaxonomyTerms("shared_content_age");

        expect(result).toMatchObject({ ok: false, error: { type: "invalid-response" } });
        expect(fetchImplementation).toHaveBeenCalledOnce();
    });
});
