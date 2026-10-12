import "server-only";
import type { OnboardingModule, Selection } from "@/features/ung/onboarding/domain/onboarding";
import type { OnboardingResult, ResultSection } from "@/features/ung/onboarding/domain/results";
import { buildArticleHref } from "@/features/ung/onboarding/domain/selectionParams";
import { buildOnboardingModule } from "@/features/ung/onboarding/server/drupal/buildOnboardingModule.server";
import { jobQuiz } from "@/features/ung/onboarding/server/local/jobQuiz";
import { MOCK_ARTICLE_ID, mockArticle, mockArticleQuiz } from "@/features/ung/onboarding/server/mock/mockArticle";
import {
    createMockOnboardingClient,
    MOCK_GOALS_PARENT_ID,
    MOCK_ONBOARDING_ARTICLE_ID,
} from "@/features/ung/onboarding/server/mock/mockOnboardingWebform";
import { type MockResultItem, mockResultSections } from "@/features/ung/onboarding/server/mock/mockResults";
import type { SharedContentResult } from "@/features/ung/onboarding/server/sharedContentResult";
import type { SharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";

/**
 * Kilde for SHARED_CONTENT_SOURCE=mock: alt innhold er lokalt, og ingen kall går til API-et.
 * Onboarding-modulen bygges likevel med den ekte Webform-parseren og module-builderen (mot en
 * lokal fixture-klient, se mockOnboardingWebform.ts), slik at mock- og live-modus følger samme
 * kontrakt (se Step 6 i implementeringsplanen).
 */
export const mockSharedContentSource: SharedContentSource = {
    async getOnboardingModule() {
        const built = await getMockBuiltModule();
        if (!built.ok) {
            return built;
        }
        return { ok: true, data: built.data };
    },

    async getResults(selection) {
        const built = await getMockBuiltModule();
        if (!built.ok) {
            return built;
        }
        return { ok: true, data: getMockResults(selection, built.data) };
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

async function getMockBuiltModule(): Promise<SharedContentResult<OnboardingModule>> {
    const built = await buildOnboardingModule(
        createMockOnboardingClient(),
        MOCK_ONBOARDING_ARTICLE_ID,
        MOCK_GOALS_PARENT_ID,
    );
    return built.ok ? { ok: true, data: built.data.module } : built;
}

function getMockResults(selection: Selection, module: OnboardingModule): OnboardingResult {
    const selectedOptionIds = new Set(Object.values(selection).flatMap((answer) => answer.optionIds));
    const sections: ResultSection[] = mockResultSections
        .map((section) => ({
            id: section.id,
            title: section.title,
            content: section.items.filter((item) => isVisible(item, selectedOptionIds)).map((item) => item.content),
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
                href: buildArticleHref(mockArticle.id, selection, module),
            },
        ],
    });

    return { title: module.resultTitle, intro: module.resultIntro, sections };
}

function isVisible(item: MockResultItem, selectedOptionIds: ReadonlySet<string>): boolean {
    if (item.showWithoutAnswers) {
        return true;
    }
    return item.answerIds.some((answerId) => selectedOptionIds.has(answerId));
}
