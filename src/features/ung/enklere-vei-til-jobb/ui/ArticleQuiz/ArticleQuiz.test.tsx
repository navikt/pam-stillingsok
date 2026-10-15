import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import type { ArticleQuiz as ArticleQuizData } from "@/features/ung/enklere-vei-til-jobb/domain/article";
import { sanitizeSharedContentHtml } from "@/features/ung/enklere-vei-til-jobb/server/sanitizeSharedContentHtml.server";
import { ArticleQuiz } from "./ArticleQuiz";

const { trackMock } = vi.hoisted(() => ({ trackMock: vi.fn() }));
vi.mock("@/app/_common/umami", () => ({ track: trackMock }));

const quiz: ArticleQuizData = {
    sections: [
        {
            id: "section",
            questions: [
                {
                    id: "constructor",
                    statement: "Har du svart?",
                    options: [
                        {
                            id: "yes",
                            label: "Ja",
                            isCorrect: true,
                            feedbackHtml: sanitizeSharedContentHtml("Riktig"),
                        },
                        {
                            id: "no",
                            label: "Nei",
                            isCorrect: false,
                            feedbackHtml: sanitizeSharedContentHtml("Prøv igjen"),
                        },
                    ],
                },
            ],
        },
    ],
};

describe("ArticleQuiz", () => {
    it("behandler ikke arvede objektnavn som besvarte spørsmål", async () => {
        const user = userEvent.setup();
        render(<ArticleQuiz quiz={quiz} articleId="article" />);

        expect(screen.queryByRole("heading", { name: "0 av 1 riktige!" })).not.toBeInTheDocument();
        expect(trackMock).not.toHaveBeenCalledWith("Fullført - Enklere vei til jobb-quiz", expect.anything());

        await user.click(screen.getByRole("radio", { name: "Ja" }));

        expect(screen.getByRole("heading", { name: "1 av 1 riktige!" })).toBeInTheDocument();
        expect(trackMock).toHaveBeenCalledWith(
            "Fullført - Enklere vei til jobb-quiz",
            expect.objectContaining({ quizId: "article", totalQuestions: 1, correctAnswers: 1 }),
        );
    });

    it("annonserer fullføring og resultat i en statusregion", async () => {
        const user = userEvent.setup();
        render(<ArticleQuiz quiz={quiz} articleId="article" />);

        await user.click(screen.getByRole("radio", { name: "Ja" }));

        const completionMessage = screen.getByText("Quizen er fullført. Du fikk 1 av 1 riktige.");
        expect(completionMessage).toHaveAttribute("role", "status");
        expect(completionMessage).toHaveAttribute("aria-atomic", "true");
    });
});
