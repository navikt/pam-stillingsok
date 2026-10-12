import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import { defaultSelection, type OnboardingModule, type Selection } from "@/features/ung/onboarding/domain/onboarding";
import { encodeSelectionParams } from "@/features/ung/onboarding/domain/selectionParams";
import {
    MOCK_AGE_UNDER_18,
    MOCK_EXPERIENCE_SOME,
    MOCK_GOAL_FIND_JOB,
    MOCK_GOAL_INTERVIEW,
} from "@/features/ung/onboarding/server/mock/mockOnboardingWebform";
import { mockSharedContentSource } from "@/features/ung/onboarding/server/mock/mockSharedContentSource.server";
import { OnboardingWizard } from "@/features/ung/onboarding/ui/OnboardingWizard";

const navigation = vi.hoisted(() => ({
    push: vi.fn(),
}));

vi.mock("next/navigation", () => ({
    useRouter: () => ({
        push: navigation.push,
    }),
}));

function expectedHref(module: OnboardingModule, selection: Selection) {
    const searchParams = encodeSelectionParams(selection, module);
    return `/ung/enklere-vei-til-jobb/resultat?${searchParams.toString()}`;
}

describe("OnboardingWizard", () => {
    beforeEach(() => {
        navigation.push.mockClear();
    });

    it("beholder valg mellom stegene og fullfører med alle valgte svar", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        render(<OnboardingWizard module={module} />);

        await user.click(screen.getByRole("radio", { name: "Under 18 år" }));
        await user.selectOptions(screen.getByRole("combobox", { name: "Hva er din situasjon nå?" }), [
            MOCK_EXPERIENCE_SOME,
        ]);
        await user.click(screen.getByRole("button", { name: "Neste" }));

        const goalsHeading = screen.getByRole("heading", { level: 2, name: "Mål" });
        await waitFor(() => expect(goalsHeading).toHaveFocus());

        await user.click(screen.getByRole("button", { name: "Tilbake" }));
        expect(screen.getByRole("radio", { name: "Under 18 år" })).toBeChecked();
        expect(screen.getByRole("combobox", { name: "Hva er din situasjon nå?" })).toHaveValue(MOCK_EXPERIENCE_SOME);

        await user.click(screen.getByRole("button", { name: "Neste" }));
        await user.click(screen.getByRole("checkbox", { name: "Finne en jobb" }));
        await user.click(screen.getByRole("checkbox", { name: "Forberede meg til intervju" }));
        await user.click(screen.getByRole("button", { name: "Fullfør" }));

        expect(navigation.push).toHaveBeenCalledWith(
            expectedHref(module, {
                age: { dimension: "age", optionIds: [MOCK_AGE_UNDER_18] },
                experience: { dimension: "experience", optionIds: [MOCK_EXPERIENCE_SOME] },
                goals: { dimension: "audiences", optionIds: [MOCK_GOAL_FIND_JOB, MOCK_GOAL_INTERVIEW] },
            }),
        );
    });

    it("forkaster midlertidige valg når brukeren hopper over", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        render(<OnboardingWizard module={module} />);

        await user.selectOptions(screen.getByRole("combobox", { name: "Hva er din situasjon nå?" }), [
            MOCK_EXPERIENCE_SOME,
        ]);
        await user.click(screen.getByRole("button", { name: "Hopp over" }));

        expect(navigation.push).toHaveBeenCalledWith(expectedHref(module, defaultSelection(module)));
    });

    it("fullfører uten svar", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        render(<OnboardingWizard module={module} />);

        await user.click(screen.getByRole("button", { name: "Neste" }));
        await user.click(screen.getByRole("button", { name: "Fullfør" }));

        expect(navigation.push).toHaveBeenCalledWith(expectedHref(module, defaultSelection(module)));
    });

    it("har ingen automatiske UU-feil på første steg", async () => {
        const module = await getOnboardingModule();
        const { container } = render(<OnboardingWizard module={module} />);

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
