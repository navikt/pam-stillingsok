import { Heading } from "@navikt/ds-react";
import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import { ResultContent } from "@/features/ung/onboarding/ui/ResultContent";

describe("ResultContent", () => {
    it("viser artikler og sanitert spørsmål-og-svar-innhold uten UU-feil", async () => {
        const user = userEvent.setup();
        const result = await getOnboardingResult(["age-under-18", "goal-interview"]);
        const { container } = render(
            <main>
                <Heading level="1" size="xlarge">
                    {result.title}
                </Heading>
                <ResultContent result={result} />
            </main>,
        );

        expect(screen.getByRole("link", { name: "Gjør deg klar til å søke jobb" })).toHaveAttribute(
            "href",
            "/ung/artikler/5-tips-til-deg-som-skal-soke-sommerjobb",
        );
        expect(screen.getByRole("link", { name: "Slik forbereder du deg til intervju" })).toBeInTheDocument();

        const teaserImage = container.querySelector('img[alt=""]');
        expect(teaserImage).toBeInTheDocument();
        expect(teaserImage).toHaveAttribute("src", expect.stringContaining("ki-soknad-ung.jpg"));

        expect(screen.getByRole("button", { name: "Hvilke jobber kan jeg få under 18?" })).toHaveAttribute(
            "aria-expanded",
            "true",
        );
        expect(
            screen.getByRole("button", { name: "Spill av video: 5 tips til deg som skal søke sommerjobb" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("link", { name: "Regler for arbeid under 18 år" })).toHaveAttribute(
            "href",
            "https://www.arbeidstilsynet.no/arbeidstid-og-organisering/arbeidstid/barn-og-ungdom-i-arbeid/",
        );

        await user.click(screen.getByRole("button", { name: "Hvor finner jeg relevante stillinger å søke på?" }));
        const vimeoLoadButton = screen.getByRole("button", {
            name: "Spill av video: Hvordan finner jeg flere relevante jobber?",
        });
        expect(vimeoLoadButton).toBeInTheDocument();
        expect(container.querySelector('iframe[src*="vimeo.com"]')).not.toBeInTheDocument();

        await act(async () => {
            await runAxeTest(container);
        });
    });

    it("laster Qbrick-spilleren først etter at brukeren trykker på avspillingsknappen", async () => {
        const user = userEvent.setup();
        const result = await getOnboardingResult(["age-under-18"]);

        render(<ResultContent result={result} />);

        const title = "5 tips til deg som skal søke sommerjobb";
        expect(screen.queryByTitle(title)).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: `Spill av video: ${title}` }));

        const iframe = screen.getByTitle(title);
        expect(iframe.getAttribute("src")).toContain("https://play2.qbrick.com/qplayer/index.html");
        expect(iframe.getAttribute("src")).toContain("mediaId=b87f69fe-5b28-40e6-8446-6e08c8beb3d5");
    });

    it("laster Vimeo-spilleren først etter at brukeren trykker på avspillingsknappen", async () => {
        const user = userEvent.setup();
        const result = await getOnboardingResult(["age-under-18", "goal-interview"]);

        render(<ResultContent result={result} />);

        await user.click(screen.getByRole("button", { name: "Hvor finner jeg relevante stillinger å søke på?" }));
        const title = "Hvordan finner jeg flere relevante jobber?";
        expect(screen.queryByTitle(title)).not.toBeInTheDocument();

        await user.click(screen.getByRole("button", { name: `Spill av video: ${title}` }));

        const iframe = screen.getByTitle(title);
        expect(iframe).toHaveAttribute("src", "https://player.vimeo.com/video/1180806925?dnt=1&autoplay=1");
    });

    it("viser flere spørsmål i en Accordion", async () => {
        const result = await getOnboardingResult(["goal-rights", "goal-support"]);

        render(<ResultContent result={result} />);

        expect(
            screen.getByRole("button", { name: "Hvilke rettigheter har jeg som ung arbeidstaker?" }),
        ).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Hvor kan jeg få hjelp til å søke jobb?" })).toBeInTheDocument();
        expect(screen.getByRole("button", { name: "Hvordan kommer jeg i gang?" })).toBeInTheDocument();
    });
});

async function getOnboardingResult(answerIds: readonly string[]) {
    const result = await mockSharedContentSource.getResults({ answerIds });
    if (!result.ok) {
        throw new Error("Kunne ikke hente resultat-fixture");
    }
    return result.data;
}
