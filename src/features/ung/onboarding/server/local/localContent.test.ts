import { describe, expect, it } from "vitest";
import { jobQuiz } from "@/features/ung/onboarding/server/local/jobQuiz";
import { onboardingModule } from "@/features/ung/onboarding/server/local/onboardingModule";
import { mockArticle } from "@/features/ung/onboarding/server/mock/mockArticle";
import { mockResultSections } from "@/features/ung/onboarding/server/mock/mockResults";
import { isSafeContentHref, isSafeVimeoHref } from "@/features/ung/onboarding/server/urlSafety";

// Typene sikrer formen på det lokale innholdet. Testene under sikrer reglene typene ikke kan uttrykke.

function expectUnique(ids: readonly string[]): void {
    expect(new Set(ids).size).toBe(ids.length);
}

describe("onboardingModule", () => {
    it("har spørsmål med svaralternativer og unike svar-ID-er på tvers av spørsmål", () => {
        expect(onboardingModule.questions.length).toBeGreaterThan(0);
        for (const question of onboardingModule.questions) {
            expect(question.options.length).toBeGreaterThan(0);
        }
        expectUnique(onboardingModule.questions.map((question) => question.id));
        expectUnique(onboardingModule.questions.flatMap((question) => question.options.map((option) => option.id)));
    });
});

describe("jobQuiz", () => {
    const questions = jobQuiz.sections.flatMap((section) => section.questions);

    it("har unike ID-er", () => {
        expectUnique(jobQuiz.sections.map((section) => section.id));
        expectUnique(questions.map((question) => question.id));
        expectUnique(questions.flatMap((question) => question.options.map((option) => option.id)));
    });

    it("har minst to alternativer og nøyaktig ett riktig svar per spørsmål", () => {
        for (const question of questions) {
            expect(question.options.length).toBeGreaterThanOrEqual(2);
            expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
        }
    });

    it("har trygge lenker", () => {
        for (const question of questions) {
            expect(isSafeContentHref(question.feedback.href)).toBe(true);
        }
    });
});

describe("mockResultSections", () => {
    const contents = mockResultSections.flatMap((section) => section.items.map((item) => item.content));

    it("har unikt innhold med gyldige svar-ID-er", () => {
        expectUnique(contents.map((content) => content.id));
        const optionIds = new Set(
            onboardingModule.questions.flatMap((question) => question.options.map((option) => option.id)),
        );
        for (const item of mockResultSections.flatMap((section) => section.items)) {
            for (const answerId of item.answerIds) {
                expect(optionIds.has(answerId)).toBe(true);
            }
        }
    });

    it("har trygge lenker", () => {
        for (const content of contents) {
            if (content.type === "article") {
                expect(isSafeContentHref(content.href)).toBe(true);
                continue;
            }
            for (const block of content.blocks) {
                if (block.type === "link" || block.type === "related-card") {
                    expect(isSafeContentHref(block.href)).toBe(true);
                }
                if (block.type === "video" && block.provider === "vimeo") {
                    expect(isSafeVimeoHref(block.href)).toBe(true);
                }
            }
        }
    });
});

describe("mockArticle", () => {
    it("dekker alle blokktypene", () => {
        expect(new Set(mockArticle.blocks.map((block) => block.type))).toEqual(
            new Set(["rich-text", "heading", "accordion", "title-text-image", "video", "spacer"]),
        );
    });
});
