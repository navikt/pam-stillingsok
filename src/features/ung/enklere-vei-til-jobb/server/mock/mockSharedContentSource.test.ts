import { afterEach, describe, expect, it, vi } from "vitest";
import { MOCK_ARTICLE_ID } from "@/features/ung/enklere-vei-til-jobb/server/mock/mockArticle";
import {
    MOCK_AGE_UNDER_18,
    MOCK_GOAL_RIGHTS,
} from "@/features/ung/enklere-vei-til-jobb/server/mock/mockOnboardingTaxonomy";
import { mockSharedContentSource } from "@/features/ung/enklere-vei-til-jobb/server/mock/mockSharedContentSource.server";

const JOB_QUIZ_ARTICLE_ID = "e8cbb6a9-8db5-487b-8738-02245a1e9a30";

describe("mockSharedContentSource", () => {
    afterEach(() => {
        vi.unstubAllEnvs();
    });

    it("returnerer bare generisk innhold uten svar", async () => {
        const result = await mockSharedContentSource.getResults({});

        expect(result.ok).toBe(true);
        if (!result.ok) {
            throw new Error(result.error.message);
        }
        expect(result.data.sections.flatMap((section) => section.content).map((content) => content.id)).toEqual([
            "article-ready-to-apply",
            "faq-summer-jobs",
            "faq-apprenticeship",
            "faq-general",
            "faq-cv",
            "faq-find-jobs",
            MOCK_ARTICLE_ID,
        ]);
    });

    it("beholder generisk innhold og legger til innhold som matcher ett av svarene", async () => {
        const result = await mockSharedContentSource.getResults({
            age: { dimension: "age", optionIds: [MOCK_AGE_UNDER_18] },
            goals: { dimension: "audiences", optionIds: [MOCK_GOAL_RIGHTS] },
        });

        expect(result.ok).toBe(true);
        if (!result.ok) {
            throw new Error(result.error.message);
        }
        expect(result.data.sections.flatMap((section) => section.content).map((content) => content.id)).toEqual([
            "article-under-18",
            "article-ready-to-apply",
            "faq-under-18",
            "faq-summer-jobs",
            "faq-apprenticeship",
            "faq-rights",
            "faq-general",
            "faq-cv",
            "faq-find-jobs",
            MOCK_ARTICLE_ID,
        ]);
    });

    it("lenker eksempelartikkelen til artikkelsida med valgene bevart", async () => {
        const result = await mockSharedContentSource.getResults({
            age: { dimension: "age", optionIds: [MOCK_AGE_UNDER_18] },
        });

        expect(result.ok).toBe(true);
        if (!result.ok) {
            throw new Error(result.error.message);
        }
        const card = result.data.sections.flatMap((section) => section.content).find((c) => c.id === MOCK_ARTICLE_ID);
        expect(card).toMatchObject({ type: "article", href: expect.stringContaining(`/artikkel/${MOCK_ARTICLE_ID}?`) });
    });

    it("returnerer eksempelartikkelen med quiz, og not-found for andre ID-er", async () => {
        const article = await mockSharedContentSource.getArticle(MOCK_ARTICLE_ID);
        expect(article.ok).toBe(true);
        if (!article.ok || !article.data.webformId) {
            throw new Error("Eksempelartikkelen mangler quiz");
        }
        expect((await mockSharedContentSource.getArticleQuiz(article.data.webformId)).ok).toBe(true);
        expect(await mockSharedContentSource.getArticle("8eb7f9d6-361c-4ac0-92c6-b272374e84d5")).toMatchObject({
            ok: false,
            error: { type: "not-found" },
        });
    });

    it("gjør jobbquizartikkelen tilgjengelig i mock-modus", async () => {
        vi.stubEnv("JOB_QUIZ_ARTICLE_ID", JOB_QUIZ_ARTICLE_ID);

        expect(await mockSharedContentSource.isArticlePublished(JOB_QUIZ_ARTICLE_ID)).toEqual({
            ok: true,
            data: true,
        });
        expect(await mockSharedContentSource.getArticle(JOB_QUIZ_ARTICLE_ID)).toMatchObject({
            ok: true,
            data: { id: JOB_QUIZ_ARTICLE_ID, webformId: expect.any(String) },
        });
    });
});
