import "server-only";
import type { Selection } from "@/features/ung/onboarding/domain/onboarding";
import type { OnboardingResult, ResultSection } from "@/features/ung/onboarding/domain/results";
import { buildArticleHref } from "@/features/ung/onboarding/domain/selectionParams";
import { jobQuiz } from "@/features/ung/onboarding/server/local/jobQuiz";
import { onboardingModule } from "@/features/ung/onboarding/server/local/onboardingModule";
import { MOCK_ARTICLE_ID, mockArticle, mockArticleQuiz } from "@/features/ung/onboarding/server/mock/mockArticle";
import { type MockResultItem, mockResultSections } from "@/features/ung/onboarding/server/mock/mockResults";
import type { SharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";

/** Kilde for SHARED_CONTENT_SOURCE=mock: alt innhold er lokalt, og ingen kall går til API-et. */
export const mockSharedContentSource: SharedContentSource = {
    async getOnboardingModule() {
        return { ok: true, data: onboardingModule };
    },

    async getResults(selection) {
        return { ok: true, data: getMockResults(selection) };
    },

    async getJobQuiz() {
        return { ok: true, data: jobQuiz };
    },

    async getArticle(articleId) {
        if (articleId !== MOCK_ARTICLE_ID) {
            return { ok: false, error: { type: "not-found", message: "Mockkilden har bare én eksempelartikkel" } };
        }
        return { ok: true, data: mockArticle };
    },

    async getArticleQuiz() {
        return { ok: true, data: mockArticleQuiz };
    },
};

function getMockResults(selection: Selection): OnboardingResult {
    const selectedAnswerIds = new Set(selection.answerIds);
    const sections: ResultSection[] = mockResultSections
        .map((section) => ({
            id: section.id,
            title: section.title,
            content: section.items.filter((item) => isVisible(item, selectedAnswerIds)).map((item) => item.content),
        }))
        .filter((section) => section.content.length > 0);

    sections.push({
        id: "mock-article",
        title: "Eksempelartikkel",
        content: [
            {
                id: mockArticle.id,
                type: "article",
                title: mockArticle.title,
                description: mockArticle.intro,
                href: buildArticleHref(mockArticle.id, selection),
            },
        ],
    });

    return { title: onboardingModule.resultTitle, intro: onboardingModule.resultIntro, sections };
}

function isVisible(item: MockResultItem, selectedAnswerIds: ReadonlySet<string>): boolean {
    if (item.showWithoutAnswers) {
        return true;
    }
    return item.answerIds.some((answerId) => selectedAnswerIds.has(answerId));
}
