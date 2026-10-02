import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type { ArticleQuiz as ArticleQuizData } from "@/features/ung/onboarding/domain/article";
import { sanitizeSharedContentHtml } from "@/features/ung/onboarding/server/sanitizeSharedContentHtml.server";
import { ArticleQuiz } from "@/features/ung/onboarding/ui/ArticleQuiz";

const quiz: ArticleQuizData = {
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
};

describe("ArticleQuiz", () => {
    it("kan besvares med tastatur og annonserer feedback uten nettverkskall", async () => {
        const user = userEvent.setup();
        const { container } = render(
            <main>
                <h1>Artikkel</h1>
                <ArticleQuiz quiz={quiz} />
            </main>,
        );

        expect(screen.getByRole("heading", { level: 2, name: "Test deg selv" })).toBeInTheDocument();
        expect(screen.getByRole("status")).toBeEmptyDOMElement();

        await user.tab();
        await user.keyboard(" ");

        expect(screen.getByRole("radio", { name: "Ja" })).toBeChecked();
        expect(screen.getByRole("status")).toHaveTextContent("Riktig svar");
        expect(screen.getByRole("status")).toHaveTextContent("Bra jobbet");

        await user.click(screen.getByRole("radio", { name: "Nei" }));
        expect(screen.getByRole("status")).toHaveTextContent("Feil svar");
        expect(screen.getByRole("status")).toHaveTextContent("Prøv jobbportaler");

        await act(async () => {
            await runAxeTest(container);
        });
    });

    it("viser feedback uten riktig/feil-merking når quizen er ungradert", async () => {
        const ungradedQuiz: ArticleQuizData = {
            questions: [
                {
                    id: "q1",
                    statement: "Finner du jobber du kan søke på?",
                    options: [
                        { id: "ja", label: "Ja", isCorrect: false, feedbackHtml: sanitizeSharedContentHtml("Supert!") },
                        {
                            id: "trenger-tips",
                            label: "Trenger tips",
                            isCorrect: false,
                            feedbackHtml: sanitizeSharedContentHtml("Her er noen tips."),
                        },
                    ],
                },
            ],
        };
        const user = userEvent.setup();
        const { container } = render(
            <main>
                <h1>Artikkel</h1>
                <ArticleQuiz quiz={ungradedQuiz} />
            </main>,
        );

        await user.click(screen.getByRole("radio", { name: "Ja" }));

        expect(screen.getByRole("status")).toHaveTextContent("Supert!");
        expect(screen.getByRole("status")).not.toHaveTextContent("Riktig svar");
        expect(screen.getByRole("status")).not.toHaveTextContent("Feil svar");

        await act(async () => {
            await runAxeTest(container);
        });
    });
});
