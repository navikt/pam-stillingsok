import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import { ResultFilters } from "@/features/ung/onboarding/ui/ResultFilters";

const navigation = vi.hoisted(() => ({
    replace: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    usePathname: () => "/ung/enklere-vei-til-jobb/resultat",
    useRouter: () => ({
        replace: navigation.replace,
    }),
}));

describe("ResultFilters", () => {
    beforeEach(() => {
        navigation.replace.mockClear();
    });

    it("viser URL-valgene og oppdaterer innholdet med en gang et valg endres", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        const { rerender } = render(
            <ResultFilters module={module} selection={{ answerIds: ["age-under-18", "goal-find-job"] }} />,
        );

        const ageSelect = screen.getByRole("combobox", { name: "Hvor gammel er du?" });
        expect(ageSelect).toHaveValue("age-under-18");

        await user.selectOptions(ageSelect, "age-18-or-older");
        await waitFor(() =>
            expect(navigation.replace).toHaveBeenLastCalledWith(
                "/ung/enklere-vei-til-jobb/resultat?v=2&svar=age-18-or-older&svar=goal-find-job",
                { scroll: false },
            ),
        );
        expect(screen.queryByRole("button", { name: "Oppdater innhold" })).not.toBeInTheDocument();

        const expansionButton = screen.getByRole("button", { name: "Vis mer" });
        await user.click(expansionButton);
        const findJob = screen.getByRole("checkbox", { name: "Finne en jobb" });
        expect(findJob).toBeChecked();
        await user.click(findJob);
        expect(findJob).not.toBeChecked();
        await waitFor(() =>
            expect(navigation.replace).toHaveBeenLastCalledWith(
                "/ung/enklere-vei-til-jobb/resultat?v=2&svar=age-18-or-older",
                { scroll: false },
            ),
        );

        const interview = screen.getByRole("checkbox", { name: "Forberede meg til intervju" });
        await user.click(interview);
        expect(interview).toBeChecked();

        await waitFor(() =>
            expect(navigation.replace).toHaveBeenLastCalledWith(
                "/ung/enklere-vei-til-jobb/resultat?v=2&svar=age-18-or-older&svar=goal-interview",
                { scroll: false },
            ),
        );
        expect(navigation.replace).toHaveBeenCalledTimes(3);

        rerender(<ResultFilters module={module} selection={{ answerIds: ["age-18-or-older", "goal-interview"] }} />);

        expect(interview).toHaveFocus();
        expect(expansionButton).toHaveAttribute("aria-expanded", "true");
        expect(interview).toBeChecked();
        expect(navigation.replace).toHaveBeenCalledTimes(3);
    });

    it("bruker første alternativ som standard og tillater ikke å velge bort svaret", async () => {
        const module = await getOnboardingModule();

        render(<ResultFilters module={module} selection={{ answerIds: [] }} />);

        const ageSelect = screen.getByRole("combobox", { name: "Hvor gammel er du?" });
        expect(ageSelect).toHaveValue("age-under-18");
        expect(screen.queryByRole("option", { name: "Ingen valgt" })).not.toBeInTheDocument();

        const situationSelect = screen.getByRole("combobox", { name: "Hva er din situasjon nå?" });
        expect(situationSelect).toHaveValue("situation-no-experience");
    });

    it("har ingen automatiske UU-feil", async () => {
        const module = await getOnboardingModule();
        const { container } = render(<ResultFilters module={module} selection={{ answerIds: [] }} />);

        await act(async () => {
            await runAxeTest(container);
        });
    });
});

async function getOnboardingModule() {
    const result = await mockSharedContentSource.getOnboardingModule();
    if (!result.ok) {
        throw new Error("Kunne ikke hente onboarding-fixture");
    }
    return result.data;
}
