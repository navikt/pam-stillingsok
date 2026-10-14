import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type { ArticleQuiz as ArticleQuizData } from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { sanitizeSharedContentHtml } from "@/features/ung/enklere-vei-til-jobb/server/sanitizeSharedContentHtml.server";
import { ArticleQuiz } from "@/features/ung/enklere-vei-til-jobb/ui/ArticleQuiz";

const track = vi.hoisted(() => vi.fn());
vi.mock("@/app/_common/umami", () => ({ track }));

const quiz: ArticleQuizData = {
    sections: [
        {
            id: "ungrouped",
            questions: [
                {
                    id: "q1",
                    statement: "Kan du finne en jobb å søke på?",
                    options: [
                        {
                            id: "ja",
                            label: "Ja",
                            isCorrect: true,
                            feedbackHtml: sanitizeSharedContentHtml("<p>Bra jobbet</p>"),
                        },
                        {
                            id: "nei",
                            label: "Nei",
                            isCorrect: false,
                            feedbackHtml: sanitizeSharedContentHtml("<p>Prøv jobbportaler</p>"),
                        },
                    ],
                },
            ],
        },
    ],
};

const multiQuestionQuiz: ArticleQuizData = {
    sections: [
        {
            id: "ungrouped",
            questions: [
                ...quiz.sections.flatMap((section) => section.questions),
                {
                    id: "q2",
                    statement: "Bør du tilpasse søknaden til stillingen?",
                    options: [
                        {
                            id: "ja-q2",
                            label: "Ja",
                            isCorrect: true,
                            feedbackHtml: sanitizeSharedContentHtml("<p>Riktig. Vis hvorfor du passer til jobben.</p>"),
                        },
                        {
                            id: "nei-q2",
                            label: "Nei",
                            isCorrect: false,
                            feedbackHtml: sanitizeSharedContentHtml(
                                "<p>Feil. En tilpasset søknad er lettere å vurdere.</p>",
                            ),
                        },
                    ],
                },
            ],
        },
    ],
};

describe("ArticleQuiz", () => {
    beforeEach(() => {
        track.mockClear();
    });

    it("kan besvares med tastatur og annonserer feedback uten nettverkskall", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <main>
                <h1>Artikkel</h1>
                <ArticleQuiz quiz={quiz} articleId="article-test" />
            </main>,
        );

        expect(screen.getByRole("heading", { level: 2, name: "Test deg selv" })).toBeInTheDocument();
        expect(screen.getByRole("status")).toBeEmptyDOMElement();

        await user.tab();
        await user.keyboard(" ");

        expect(screen.getByRole("radio", { name: "Ja" })).toBeChecked();
        expect(screen.getByRole("status")).toHaveTextContent("Riktig svar");
        expect(screen.getByRole("status")).toHaveTextContent("Bra jobbet");
        expect(track).toHaveBeenCalledWith(
            "Valg - Enklere vei til jobb",
            expect.objectContaining({
                location: "artikkelquiz",
                questionId: "q1",
                optionId: "ja",
                quizId: "article-test",
                isCorrect: true,
            }),
        );

        await user.click(screen.getByRole("radio", { name: "Nei" }));
        expect(screen.getByRole("status")).toHaveTextContent("Feil svar");
        expect(screen.getByRole("status")).toHaveTextContent("Prøv jobbportaler");

        await act(async () => {
            await runAxeTest(container);
        });
    });

    it("viser fremdrift og sluttscore og nullstiller quizen", async () => {
        const user = userEvent.setup();
        render(
            <main>
                <h1>Artikkel</h1>
                <ArticleQuiz quiz={multiQuestionQuiz} articleId="article-test" />
            </main>,
        );

        const firstQuestion = screen.getByRole("radiogroup", { name: "Kan du finne en jobb å søke på?" });
        await user.click(within(firstQuestion).getByRole("radio", { name: "Ja" }));

        expect(screen.getByRole("progressbar", { name: "1 av 2 spørsmål besvart" })).toHaveAttribute(
            "aria-valuenow",
            "1",
        );

        const secondQuestion = screen.getByRole("radiogroup", {
            name: "Bør du tilpasse søknaden til stillingen?",
        });
        await user.click(within(secondQuestion).getByRole("radio", { name: "Ja" }));

        expect(screen.getByRole("heading", { level: 2, name: "2 av 2 riktige!" })).toBeVisible();
        expect(screen.getByText("2/2 riktige")).toBeVisible();
        expect(track).toHaveBeenCalledWith("Fullført - Enklere vei til jobb-quiz", {
            quizType: "artikkelquiz",
            quizId: "article-test",
            totalQuestions: 2,
            correctAnswers: 2,
        });

        const quizSection = screen.getByRole("region", { name: "Test deg selv" });
        await user.click(screen.getByRole("button", { name: "Ta quizen på nytt" }));
        expect(track).toHaveBeenCalledWith(
            "Klikk - Enklere vei til jobb",
            expect.objectContaining({ action: "nullstill-quiz", location: "artikkelquiz" }),
        );

        expect(quizSection).toHaveFocus();
        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "2 av 2 riktige!" })).not.toBeInTheDocument();
        for (const radio of screen.getAllByRole("radio")) {
            expect(radio).not.toBeChecked();
        }
    });

    it("viser grupper med tittel og tema fra Webform", () => {
        const groupedQuiz: ArticleQuizData = {
            sections: [
                {
                    id: "find-job",
                    title: "Finn jobb",
                    theme: "rose",
                    questions: quiz.sections.flatMap((section) => section.questions),
                },
                {
                    id: "interview",
                    title: "Intervju",
                    theme: "mint",
                    questions: multiQuestionQuiz.sections.flatMap((section) => section.questions).slice(1),
                },
            ],
        };

        render(
            <main>
                <h1>Artikkel</h1>
                <ArticleQuiz quiz={groupedQuiz} articleId="article-test" />
            </main>,
        );

        const findJobSection = screen.getByRole("region", { name: "Finn jobb" });
        const interviewSection = screen.getByRole("region", { name: "Intervju" });

        expect(findJobSection.querySelector('[data-color="brand-magenta"]')).toHaveTextContent("Finn jobb");
        expect(interviewSection.querySelector('[data-color="success"]')).toHaveTextContent("Intervju");
    });

    it("viser feedback uten riktig/feil-merking når quizen er ungradert", async () => {
        const ungradedQuiz: ArticleQuizData = {
            sections: [
                {
                    id: "ungrouped",
                    questions: [
                        {
                            id: "q1",
                            statement: "Finner du jobber du kan søke på?",
                            options: [
                                {
                                    id: "ja",
                                    label: "Ja",
                                    isCorrect: false,
                                    feedbackHtml: sanitizeSharedContentHtml("Supert!"),
                                },
                                {
                                    id: "trenger-tips",
                                    label: "Trenger tips",
                                    isCorrect: false,
                                    feedbackHtml: sanitizeSharedContentHtml("Her er noen tips."),
                                },
                            ],
                        },
                    ],
                },
            ],
        };
        const user = userEvent.setup();
        const { container } = render(
            <main>
                <h1>Artikkel</h1>
                <ArticleQuiz quiz={ungradedQuiz} articleId="article-test" />
            </main>,
        );

        await user.click(screen.getByRole("radio", { name: "Ja" }));

        expect(screen.getByRole("status")).toHaveTextContent("Supert!");
        expect(screen.getByRole("status")).not.toHaveTextContent("Riktig svar");
        expect(screen.getByRole("status")).not.toHaveTextContent("Feil svar");
        expect(screen.getByText("Alle besvart")).toBeVisible();
        expect(screen.getByRole("heading", { name: "Du har svart på alle spørsmålene" })).toBeVisible();
        expect(screen.queryByText(/riktige!/)).not.toBeInTheDocument();

        await act(async () => {
            await runAxeTest(container);
        });
    });
});
