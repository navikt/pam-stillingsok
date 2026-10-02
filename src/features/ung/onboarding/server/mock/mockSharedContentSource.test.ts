import { describe, expect, it } from "vitest";
import { MOCK_ARTICLE_ID } from "@/features/ung/onboarding/server/mock/mockArticle";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";

describe("mockSharedContentSource", () => {
    it("returnerer bare generisk innhold uten svar", async () => {
        const result = await mockSharedContentSource.getResults({ answerIds: [] });

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
            answerIds: ["age-under-18", "goal-rights"],
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
        const result = await mockSharedContentSource.getResults({ answerIds: ["age-under-18"] });

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
});
