import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import { JobQuiz } from "@/features/ung/onboarding/ui/JobQuiz";

describe("JobQuiz", () => {
    it("gir umiddelbar respons, viser sluttscore og nullstiller svarene", async () => {
        const user = userEvent.setup();
        const quiz = await getJobQuiz();

        render(<JobQuiz quiz={quiz} backHref="/ung/enklere-vei-til-jobb/resultat?v=1" />);

        const firstQuestion = quiz.sections[0]?.questions[0];
        if (!firstQuestion) {
            throw new Error("Jobbquiz-fixturen mangler spørsmål");
        }
        const firstQuestionGroup = screen.getByRole("radiogroup", { name: firstQuestion.statement });
        const wrongOption = firstQuestion.options.find((option) => !option.isCorrect);
        if (!wrongOption) {
            throw new Error("Jobbquiz-fixturen mangler feil svar");
        }

        await user.click(within(firstQuestionGroup).getByRole("radio", { name: wrongOption.label }));

        expect(screen.getByText("Feil svar")).toBeVisible();
        expect(screen.getByRole("progressbar")).toHaveAttribute("aria-valuenow", "1");

        for (const question of quiz.sections.flatMap((section) => section.questions)) {
            const correctOption = question.options.find((option) => option.isCorrect);
            if (!correctOption) {
                throw new Error(`Spørsmålet mangler riktig svar: ${question.id}`);
            }
            await user.click(
                within(screen.getByRole("radiogroup", { name: question.statement })).getByRole("radio", {
                    name: correctOption.label,
                }),
            );
        }

        expect(screen.getByRole("heading", { name: "12 av 12 riktige!" })).toBeVisible();
        expect(screen.getAllByText("3/3 riktige")).toHaveLength(4);

        await user.click(screen.getByRole("button", { name: "Ta quizen på nytt" }));

        expect(screen.queryByRole("progressbar")).not.toBeInTheDocument();
        expect(screen.queryByRole("heading", { name: "12 av 12 riktige!" })).not.toBeInTheDocument();
        for (const radio of screen.getAllByRole("radio")) {
            expect(radio).not.toBeChecked();
        }
    });

    it("beholder den kanoniske lenken tilbake til resultatsida", async () => {
        const quiz = await getJobQuiz();
        const backHref = "/ung/enklere-vei-til-jobb/resultat?v=1&svar=age-under-18&svar=situation-no-experience";

        render(<JobQuiz quiz={quiz} backHref={backHref} />);

        expect(screen.getByRole("link", { name: "Tilbake til resultater" })).toHaveAttribute("href", backHref);
    });

    it("har ingen automatiske UU-feil i ubesvart tilstand", async () => {
        const quiz = await getJobQuiz();
        const { container } = render(<JobQuiz quiz={quiz} backHref="/ung/enklere-vei-til-jobb/resultat?v=1" />);

        await act(async () => {
            await runAxeTest(container);
        });
    });
});

async function getJobQuiz() {
    const result = await mockSharedContentSource.getJobQuiz();
    if (!result.ok) {
        throw new Error("Kunne ikke hente jobbquiz-fixture");
    }
    return result.data;
}
