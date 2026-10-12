import { afterEach, describe, expect, it, vi } from "vitest";
import {
    AGE_18_OR_OLDER,
    EXPERIENCE_NONE,
    GOAL_FIND_JOB,
    ONBOARDING_WEBFORM_YAML,
} from "@/features/ung/onboarding/server/drupal/__fixtures__/onboardingWebform";
import { createSharedContentClient } from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { createLiveSharedContentSource } from "@/features/ung/onboarding/server/liveSharedContentSource.server";
import collectionFixture from "./drupal/__fixtures__/collection.json";
import onItsOwnFixture from "./drupal/__fixtures__/on_its_own.json";

const ARTICLE_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";
const WEBFORM_ID = "fcb6a11e-5b6a-400a-a4dd-69bfc36b1f69";
const GOALS_PARENT_ID = "813d0e38-b09b-4362-bd0c-6b978cc16ecb";

function createSource(fetchImplementation: typeof fetch) {
    const client = createSharedContentClient(
        { apiUrl: "https://cms.staging.karriereveiledning.no", apiKey: "secret" },
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

/** Mock-fetch som svarer med artikkel, Webform-YAML og gyldig taxonomy for alle tre
 * vokabularene, og delegerer andre kall (f.eks. samlingen) videre. */
function fetchOnboardingImplementation(onOtherRequest?: (input: Parameters<typeof fetch>[0]) => Promise<Response>) {
    return vi.fn<typeof fetch>().mockImplementation(async (input) => {
        const url = String(input);
        if (url.includes(`/jsonapi/node/shared_content/${ARTICLE_ID}`)) {
            return json(onItsOwnFixture);
        }
        if (url.includes(`/jsonapi/webform/webform/${WEBFORM_ID}`)) {
            return json({
                data: {
                    type: "webform--webform",
                    id: WEBFORM_ID,
                    attributes: { elements_combined: ONBOARDING_WEBFORM_YAML },
                },
            });
        }
        if (url.includes("/taxonomy_term/shared_content_age")) {
            return json({
                data: [taxonomyTerm("taxonomy_term--shared_content_age", AGE_18_OR_OLDER, "18 år eller eldre", 1)],
            });
        }
        if (url.includes("/taxonomy_term/shared_content_experience")) {
            return json({
                data: [taxonomyTerm("taxonomy_term--shared_content_experience", EXPERIENCE_NONE, "Ingen erfaring", 1)],
            });
        }
        if (url.includes("/taxonomy_term/situations")) {
            return json({
                data: [taxonomyTerm("taxonomy_term--situations", GOAL_FIND_JOB, "Finne en jobb", 1)],
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
    const ORIGINAL_ARTICLE_ID = process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID;

    afterEach(() => {
        if (ORIGINAL_GOALS_PARENT_ID === undefined) {
            delete process.env.SHARED_CONTENT_GOALS_PARENT_ID;
        } else {
            process.env.SHARED_CONTENT_GOALS_PARENT_ID = ORIGINAL_GOALS_PARENT_ID;
        }
        if (ORIGINAL_ARTICLE_ID === undefined) {
            delete process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID;
        } else {
            process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ORIGINAL_ARTICLE_ID;
        }
    });

    it("bygger onboarding-modulen fra artikkel, Webform og taxonomy, og bruker lokal jobbquiz", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const source = createSource(fetchOnboardingImplementation());

        const module = await source.getOnboardingModule();
        expect(module.ok).toBe(true);
        if (module.ok) {
            const ageQuestion = module.data.steps.flatMap((step) => step.questions).find((q) => q.id === "age");
            expect(ageQuestion?.options).toEqual([{ id: AGE_18_OR_OLDER, label: "18 år eller eldre" }]);
        }
        expect((await source.getJobQuiz()).ok).toBe(true);
    });

    it("gir konfigurasjonsfeil når artikkel-ID mangler", async () => {
        delete process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID;
        const client = createSharedContentClient(
            { apiUrl: "https://cms.staging.karriereveiledning.no", apiKey: "secret" },
            vi.fn<typeof fetch>(),
        );
        if (!client.ok) {
            throw new Error("Forventet gyldig klient");
        }

        expect(createLiveSharedContentSource(client.data)).toMatchObject({
            ok: false,
            error: { type: "configuration" },
        });
    });

    it("gir konfigurasjonsfeil når ankeret for mål mangler", async () => {
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        delete process.env.SHARED_CONTENT_GOALS_PARENT_ID;
        const source = createSource(fetchOnboardingImplementation());

        expect(await source.getOnboardingModule()).toMatchObject({ ok: false, error: { type: "configuration" } });
    });

    it("henter resultater live med lokal artikkelhref og lokal tittel", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const source = createSource(fetchOnboardingImplementation(async () => json(collectionFixture)));

        const result = await source.getResults({ age: { dimension: "age", optionIds: [AGE_18_OR_OLDER] } });

        if (!result.ok) {
            throw new Error("Forventet resultater");
        }
        expect(result.data.sections).toHaveLength(1);
        const content = result.data.sections[0]?.content ?? [];
        expect(content.map((item) => item.id)).toContain(ARTICLE_ID);
        expect(content[0]).toMatchObject({
            type: "article",
            href: expect.stringMatching(
                new RegExp(`^/ung/enklere-vei-til-jobb/artikkel/[0-9a-f-]{36}\\?age=age%3A${AGE_18_OR_OLDER}$`),
            ),
        });
    });

    it("sender filter til getCollection når det valgte svaret er en kjent term-ID", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const collectionFetch = vi.fn<typeof fetch>().mockImplementation(async () => json(collectionFixture));
        const source = createSource(fetchOnboardingImplementation(collectionFetch));

        await source.getResults({ age: { dimension: "age", optionIds: [AGE_18_OR_OLDER] } });

        const collectionCall = collectionFetch.mock.calls[0];
        const url = new URL(String(collectionCall?.[0]));
        expect(url.searchParams.getAll("filter[age-group][condition][value][]")).toEqual([AGE_18_OR_OLDER]);
    });

    it("sender ikke filter til getCollection når ingen valg er gjort", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const collectionFetch = vi.fn<typeof fetch>().mockImplementation(async () => json(collectionFixture));
        const source = createSource(fetchOnboardingImplementation(collectionFetch));

        await source.getResults({});

        const collectionCall = collectionFetch.mock.calls[0];
        const url = new URL(String(collectionCall?.[0]));
        expect([...url.searchParams.keys()].some((key) => key.startsWith("filter["))).toBe(false);
    });

    it("gir ingen seksjoner når Drupal ikke finner artikler for filteret", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const collectionFetch = vi.fn<typeof fetch>().mockImplementation(async (input) => {
            const url = new URL(String(input));
            const hasFilter = [...url.searchParams.keys()].some((key) => key.startsWith("filter["));
            return hasFilter ? json({ data: [] }) : json(collectionFixture);
        });
        const source = createSource(fetchOnboardingImplementation(collectionFetch));

        const result = await source.getResults({ age: { dimension: "age", optionIds: [AGE_18_OR_OLDER] } });

        expect(result).toMatchObject({ ok: true, data: { sections: [] } });
    });

    it("faller ikke tilbake til mock ved upstream-feil", async () => {
        process.env.SHARED_CONTENT_GOALS_PARENT_ID = GOALS_PARENT_ID;
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const source = createSource(fetchOnboardingImplementation(async () => json({}, 503)));

        expect(await source.getResults({})).toMatchObject({
            ok: false,
            error: { type: "http", status: 503 },
        });
    });

    it("henter artikkel og mapper 404 til not-found", async () => {
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
        const ok = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json(onItsOwnFixture)));
        expect(await ok.getArticle(ARTICLE_ID)).toMatchObject({ ok: true, data: { webformId: WEBFORM_ID } });

        const missing = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json({}, 404)));
        expect(await missing.getArticle(ARTICLE_ID)).toMatchObject({ ok: false, error: { type: "not-found" } });
    });

    it("henter og parser Webform-quiz", async () => {
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
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
        process.env.SHARED_CONTENT_ONBOARDING_ARTICLE_ID = ARTICLE_ID;
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
