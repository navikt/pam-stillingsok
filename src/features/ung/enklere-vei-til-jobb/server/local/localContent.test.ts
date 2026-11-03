import { describe, expect, it } from "vitest";
import { mockArticle } from "@/features/ung/enklere-vei-til-jobb/server/mock/mockArticle";
import {
    MOCK_AGE_UNDER_18,
    MOCK_EXPERIENCE_NONE,
    MOCK_EXPERIENCE_SOME,
    MOCK_GOAL_APPLY,
    MOCK_GOAL_FIND_JOB,
    MOCK_GOAL_INTERVIEW,
} from "@/features/ung/enklere-vei-til-jobb/server/mock/mockOnboardingTaxonomy";
import { mockResultSections } from "@/features/ung/enklere-vei-til-jobb/server/mock/mockResults";
import { isSafeContentHref } from "@/features/ung/enklere-vei-til-jobb/server/urlSafety";

// Typene sikrer formen på det lokale innholdet. Testene under sikrer reglene typene ikke kan uttrykke.

function expectUnique(ids: readonly string[]): void {
    expect(new Set(ids).size).toBe(ids.length);
}

describe("mockResultSections", () => {
    const contents = mockResultSections.flatMap((section) => section.items.map((item) => item.content));
    const mockOptionIds = new Set([
        MOCK_AGE_UNDER_18,
        MOCK_EXPERIENCE_NONE,
        MOCK_EXPERIENCE_SOME,
        MOCK_GOAL_FIND_JOB,
        MOCK_GOAL_APPLY,
        MOCK_GOAL_INTERVIEW,
    ]);

    it("har unikt innhold med gyldige svar-ID-er", () => {
        expectUnique(contents.map((content) => content.id));
        for (const item of mockResultSections.flatMap((section) => section.items)) {
            for (const answerId of item.answerIds) {
                expect(mockOptionIds.has(answerId)).toBe(true);
            }
        }
    });

    it("har trygge lenker", () => {
        for (const content of contents) {
            expect(isSafeContentHref(content.href)).toBe(true);
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
