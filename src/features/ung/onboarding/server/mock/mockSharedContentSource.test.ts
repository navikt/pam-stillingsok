import { describe, expect, it } from "vitest";
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
        ]);
    });
});
