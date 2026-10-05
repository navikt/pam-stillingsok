import { afterEach, describe, expect, it, vi } from "vitest";
import { createSharedContentClient } from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { createLiveSharedContentSource } from "@/features/ung/onboarding/server/liveSharedContentSource.server";
import collectionFixture from "./drupal/__fixtures__/collection.json";
import onItsOwnFixture from "./drupal/__fixtures__/on_its_own.json";

const ARTICLE_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";
const WEBFORM_ID = "fcb6a11e-5b6a-400a-a4dd-69bfc36b1f69";
const GOALS_PARENT_ID = "813d0e38-b09b-4362-bd0c-6b978cc16ecb";
const AGE_18_OR_OLDER = "7d074491-7231-4c1c-aef3-bdd917776198";

function createSource(fetchImplementation: typeof fetch) {
    const client = createSharedContentClient(
        { apiUrl: "https://cms.staging.karriereveiledning.no", apiKey: "test-key" },
        fetchImplementation,
    );
    if (!client.ok) {
        throw new Error("Forventet gyldig klient");
    }
    const source = createLiveSharedContentSource(client.data);
    if (!source.ok) {
        throw new Error("Forventet gyldig kilde");
    }
    return source.data;
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/vnd.api+json" } });
}

function taxonomyTerm(type: string, id: string, name: string, weight: number) {
    return { type, id, attributes: { name, weight } };
}

/** Mock-fetch som svarer med gyldig taxonomy for alle tre vokabularene, og delegerer andre kall videre. */
function fetchTaxonomyImplementation(onOtherRequest?: (input: Parameters<typeof fetch>[0]) => Promise<Response>) {
    return vi.fn<typeof fetch>().mockImplementation(async (input) => {
        const url = String(input);
        if (url.includes("/taxonomy_term/shared_content_age")) {
            return json({
                data: [taxonomyTerm("taxonomy_term--shared_content_age", AGE_18_OR_OLDER, "18 år eller eldre", 1)],
            });
        }
        if (url.includes("/taxonomy_term/shared_content_experience")) {
            return json({
                data: [
                    taxonomyTerm(
                        "taxonomy_term--shared_content_experience",
                        "0fd8124e-edf2-459d-9986-7fb2167dd3da",
                        "Ingen erfaring",
                        1,
                    ),
                ],
            });
        }
        if (url.includes("/taxonomy_term/situations")) {
            return json({
                data: [
                    taxonomyTerm(
                        "taxonomy_term--situations",
                        "03c6bc26-0b80-42c0-95aa-d001c6e9c5e2",
                        "Finne en jobb",
                        1,
                    ),
                ],
            });
        }
        if (onOtherRequest) {
            return onOtherRequest(input);
        }
        throw new Error(`Uventet URL i test: ${url}`);
    });
}

describe("liveSharedContentSource", () => {
    const ORIGINAL_GOALS_PARENT_ID = process.env.SHARED_CONTENT_GOALS_PARENT_ID;

    afterEach(() => {
        if (ORIGINAL_GOALS_PARENT_ID === undefined) {
            delete process.env.SHARED_CONTENT_GOALS_PARENT_ID;
        } else {
            process.env.SHARED_CONTENT_GOALS_PARENT_ID = ORIGINAL_GOALS_PARENT_ID;
        }
    });

    it("bygger onboarding-modulen fra taxonomy og bruker lokal jobbquiz", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        const source = createSource(fetchTaxonomyImplementation());

        const module = await source.getOnboardingModule();
        expect(module.ok).toBe(true);
        if (module.ok) {
            const ageQuestion = module.data.questions.find((question) => question.id === "question-age");
            expect(ageQuestion?.options).toEqual([{ id: AGE_18_OR_OLDER, label: "18 år eller eldre" }]);
        }
        expect((await source.getJobQuiz()).ok).toBe(true);
    });

    it("gir konfigurasjonsfeil når ankeret for mål mangler", async () => {
        delete process.env.SHARED_CONTENT_GOALS_PARENT_ID;
        const source = createSource(vi.fn<typeof fetch>());

        expect(await source.getOnboardingModule()).toMatchObject({ ok: false, error: { type: "configuration" } });
    });

    it("henter resultater live med lokal artikkelhref og lokal tittel", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        const source = createSource(fetchTaxonomyImplementation(async () => json(collectionFixture)));

        const result = await source.getResults({ answerIds: ["age-18-or-older"] });

        if (!result.ok) {
            throw new Error("Forventet resultater");
        }
        expect(result.data.sections).toHaveLength(1);
        const content = result.data.sections[0]?.content ?? [];
        expect(content.map((item) => item.id)).toContain(ARTICLE_ID);
        expect(content[0]).toMatchObject({
            type: "article",
            href: expect.stringMatching(
                /^\/ung\/enklere-vei-til-jobb\/artikkel\/[0-9a-f-]{36}\?v=2&svar=age-18-or-older$/,
            ),
        });
    });

    it("sender filter til getCollection når det valgte svaret er en kjent term-ID", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        const collectionFetch = vi.fn<typeof fetch>().mockImplementation(async () => json(collectionFixture));
        const source = createSource(fetchTaxonomyImplementation(collectionFetch));

        await source.getResults({ answerIds: [AGE_18_OR_OLDER] });

        const collectionCall = collectionFetch.mock.calls[0];
        const url = new URL(String(collectionCall?.[0]));
        expect(url.searchParams.getAll("filter[age-group][condition][value][]")).toEqual([AGE_18_OR_OLDER]);
    });

    it("sender ikke filter til getCollection når ingen valg er gjort", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        const collectionFetch = vi.fn<typeof fetch>().mockImplementation(async () => json(collectionFixture));
        const source = createSource(fetchTaxonomyImplementation(collectionFetch));

        await source.getResults({ answerIds: [] });

        const collectionCall = collectionFetch.mock.calls[0];
        const url = new URL(String(collectionCall?.[0]));
        expect([...url.searchParams.keys()].some((key) => key.startsWith("filter["))).toBe(false);
    });

    it("gir ingen seksjoner når Drupal ikke finner artikler for filteret", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        const collectionFetch = vi.fn<typeof fetch>().mockImplementation(async (input) => {
            const url = new URL(String(input));
            const hasFilter = [...url.searchParams.keys()].some((key) => key.startsWith("filter["));
            return hasFilter ? json({ data: [] }) : json(collectionFixture);
        });
        const source = createSource(fetchTaxonomyImplementation(collectionFetch));

        const result = await source.getResults({ answerIds: [AGE_18_OR_OLDER] });

        expect(result).toMatchObject({ ok: true, data: { sections: [] } });
    });

    it("faller ikke tilbake til mock ved upstream-feil", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        const source = createSource(fetchTaxonomyImplementation(async () => json({}, 503)));

        expect(await source.getResults({ answerIds: [] })).toMatchObject({
            ok: false,
            error: { type: "http", status: 503 },
        });
    });

    it("henter artikkel og mapper 404 til not-found", async () => {
        const ok = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json(onItsOwnFixture)));
        expect(await ok.getArticle(ARTICLE_ID)).toMatchObject({ ok: true, data: { webformId: WEBFORM_ID } });

        const missing = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json({}, 404)));
        expect(await missing.getArticle(ARTICLE_ID)).toMatchObject({ ok: false, error: { type: "not-found" } });
    });

    it("henter og parser Webform-quiz", async () => {
        const yaml = [
            "q1:",
            "  '#type': quiz_element_radios",
            "  '#title': Spørsmål",
            "  '#options':",
            "    a: A",
            "    b: B",
            "  '#quiz__options':",
            "    a:",
            "      is_correct: true",
            "      feedback: Riktig",
            "    b:",
            "      is_correct: false",
        ].join("\n");
        const source = createSource(
            vi.fn<typeof fetch>().mockImplementation(async () =>
                json({
                    data: { type: "webform--webform", id: WEBFORM_ID, attributes: { elements_combined: yaml } },
                }),
            ),
        );

        expect(await source.getArticleQuiz(WEBFORM_ID)).toMatchObject({
            ok: true,
            data: { questions: [{ id: "q1" }] },
        });
    });

    it("gir invalid-contract for ugyldig quiz", async () => {
        const source = createSource(
            vi.fn<typeof fetch>().mockImplementation(async () =>
                json({
                    data: { type: "webform--webform", id: WEBFORM_ID, attributes: { elements_combined: "q: [" } },
                }),
            ),
        );

        expect(await source.getArticleQuiz(WEBFORM_ID)).toMatchObject({
            ok: false,
            error: { type: "invalid-contract" },
        });
    });
});
