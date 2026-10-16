import { Heading } from "@navikt/ds-react";
import { act, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import {
    MOCK_AGE_UNDER_18,
    MOCK_GOAL_INTERVIEW,
} from "@/features/ung/enklere-vei-til-jobb/server/mock/mockOnboardingTaxonomy";
import { mockSharedContentSource } from "@/features/ung/enklere-vei-til-jobb/server/mock/mockSharedContentSource.server";
import { ResultContent } from "@/features/ung/enklere-vei-til-jobb/ui/ResultContent";

describe("ResultContent", () => {
    it("viser artikler uten UU-feil", async () => {
        const result = await getOnboardingResult([MOCK_AGE_UNDER_18, MOCK_GOAL_INTERVIEW]);
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

        await act(async () => {
            await runAxeTest(container);
        });
    });
});

async function getOnboardingResult(optionIds: readonly string[]) {
    const result = await mockSharedContentSource.getResults({
        test: { dimension: "age", optionIds },
    });
    if (!result.ok) {
        throw new Error("Kunne ikke hente resultat-fixture");
    }
    return result.data;
}
