import { describe, expect, it } from "vitest";
import jobQuizFixture from "@/features/ung/onboarding/server/mock/jobQuiz.fixture.json";
import { mapJobQuiz } from "@/features/ung/onboarding/server/mock/mockSharedContentAdapter";
import { safeParseSharedContentDocument } from "@/features/ung/onboarding/server/sharedContentSchemas";

describe("jobbquiz-fixturen", () => {
    it("beholder rekkefølgen og gir nøyaktig ett riktig svar per spørsmål", () => {
        const quiz = mapJobQuiz(parseFixture(jobQuizFixture));

        expect(quiz.sections.map((section) => section.title)).toEqual([
            "Finn jobb",
            "Søknad og CV",
            "Intervju",
            "Rettigheter",
        ]);
        expect(quiz.sections.flatMap((section) => section.questions)).toHaveLength(12);
        for (const question of quiz.sections.flatMap((section) => section.questions)) {
            expect(question.options.filter((option) => option.isCorrect)).toHaveLength(1);
        }
    });

    it("saniterer tilbakemeldingen før den når UI-et", () => {
        const fixture = replaceQuestionAttributes({
            field_feedback_content: {
                value: '<p>Trygg tekst</p><img src="x" onerror="alert(1)"><script>alert(1)</script>',
                format: "basic_html",
            },
        });

        const quiz = mapJobQuiz(parseFixture(fixture));
        const html = String(quiz.sections[0]?.questions[0]?.feedback.html);

        expect(html).toContain("<p>Trygg tekst</p>");
        expect(html).not.toContain("script");
        expect(html).not.toContain("onerror");
    });

    it("avviser skadelige les-mer-lenker", () => {
        const fixture = replaceQuestionAttributes({
            source_url: "javascript:alert(1)",
        });

        expect(() => mapJobQuiz(parseFixture(fixture))).toThrow("Quizlenken");
    });

    it("avviser spørsmål med flere riktige svar", () => {
        const fixture = {
            ...jobQuizFixture,
            included: jobQuizFixture.included.map((resource) =>
                resource.id === "quiz-option-apply-without-all-requirements-false"
                    ? {
                          ...resource,
                          attributes: {
                              ...resource.attributes,
                              field_is_correct: true,
                          },
                      }
                    : resource,
            ),
        };

        expect(() => mapJobQuiz(parseFixture(fixture))).toThrow("må ha nøyaktig ett riktig svar");
    });
});

function replaceQuestionAttributes(
    attributes: Readonly<{
        field_feedback_content?: Readonly<{ value: string; format: string }>;
        source_url?: string;
    }>,
) {
    return {
        ...jobQuizFixture,
        included: jobQuizFixture.included.map((resource) =>
            resource.id === "quiz-question-apply-without-all-requirements"
                ? {
                      ...resource,
                      attributes: {
                          ...resource.attributes,
                          ...attributes,
                      },
                  }
                : resource,
        ),
    };
}

function parseFixture(fixture: unknown) {
    const result = safeParseSharedContentDocument(fixture);
    if (!result.ok) {
        throw new Error("Test-fixturen følger ikke JSON:API-kontrakten");
    }
    return result.data;
}
