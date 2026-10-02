import { describe, expect, it, vi } from "vitest";
import { createSharedContentClient } from "@/features/ung/onboarding/server/drupal/drupalClient.server";
import { createLiveSharedContentSource } from "@/features/ung/onboarding/server/liveSharedContentSource.server";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import collectionFixture from "../../../../../docs/Enklere_vei_til_jobb/json_eksempler/collection.json";
import onItsOwnFixture from "../../../../../docs/Enklere_vei_til_jobb/json_eksempler/on_its_own.json";

const ARTICLE_ID = "cf446cee-9e2e-46cd-9e1b-09dc4cb1abbb";
const WEBFORM_ID = "fcb6a11e-5b6a-400a-a4dd-69bfc36b1f69";

function createSource(fetchImplementation: typeof fetch) {
    const client = createSharedContentClient(
        { apiUrl: "https://cms.staging.karriereveiledning.no", apiKey: "test-key" },
        fetchImplementation,
    );
    if (!client.ok) {
        throw new Error("Forventet gyldig klient");
    }
    const source = createLiveSharedContentSource(mockSharedContentSource, client.data);
    if (!source.ok) {
        throw new Error("Forventet gyldig kilde");
    }
    return source.data;
}

function json(body: unknown, status = 200): Response {
    return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/vnd.api+json" } });
}

describe("liveSharedContentSource", () => {
    it("bruker lokal onboarding og jobbquiz", async () => {
        const fetchImplementation = vi.fn<typeof fetch>();
        const source = createSource(fetchImplementation);

        expect((await source.getOnboardingModule()).ok).toBe(true);
        expect((await source.getJobQuiz()).ok).toBe(true);
        expect(fetchImplementation).not.toHaveBeenCalled();
    });

    it("henter resultater live med lokal artikkelhref og lokal tittel", async () => {
        const source = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json(collectionFixture)));

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
                /^\/ung\/enklere-vei-til-jobb\/artikkel\/[0-9a-f-]{36}\?v=1&svar=age-18-or-older$/,
            ),
        });
    });

    it("gir ingen seksjoner når ingen artikler matcher", async () => {
        const source = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json(collectionFixture)));

        const result = await source.getResults({ answerIds: ["goal-rights"] });

        expect(result).toMatchObject({ ok: true, data: { sections: [] } });
    });

    it("faller ikke tilbake til mock ved upstream-feil", async () => {
        const source = createSource(vi.fn<typeof fetch>().mockImplementation(async () => json({}, 503)));

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
