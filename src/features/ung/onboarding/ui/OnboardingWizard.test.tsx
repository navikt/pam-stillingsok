import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
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

describe("OnboardingWizard", () => {
    beforeEach(() => {
        navigation.push.mockClear();
    });

    it("beholder valg mellom stegene og fullfører med alle valgte svar", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        render(<OnboardingWizard module={module} />);

        await user.click(screen.getByRole("radio", { name: "Under 18 år" }));
        await user.click(screen.getByRole("button", { name: "Neste" }));

        const situationHeading = screen.getByRole("heading", { level: 2, name: "Hva er din situasjon nå?" });
        await waitFor(() => expect(situationHeading).toHaveFocus());
        await user.click(screen.getByRole("radio", { name: "Jeg har aldri hatt jobb" }));
        await user.click(screen.getByRole("button", { name: "Tilbake" }));

        expect(screen.getByRole("radio", { name: "Under 18 år" })).toBeChecked();

        await user.click(screen.getByRole("button", { name: "Neste" }));
        expect(screen.getByRole("radio", { name: "Jeg har aldri hatt jobb" })).toBeChecked();
        await user.click(screen.getByRole("button", { name: "Neste" }));
        await user.click(screen.getByRole("checkbox", { name: "Finne en jobb" }));
        await user.click(screen.getByRole("checkbox", { name: "Forberede meg til intervju" }));
        await user.click(screen.getByRole("button", { name: "Fullfør" }));

        expect(navigation.push).toHaveBeenCalledWith(
            "/ung/enklere-vei-til-jobb/resultat?v=1&svar=age-under-18&svar=goal-find-job&svar=goal-interview&svar=situation-no-experience",
        );
    });

    it("forkaster midlertidige valg når brukeren hopper over", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        render(<OnboardingWizard module={module} />);

        await user.click(screen.getByRole("radio", { name: "Under 18 år" }));
        await user.click(screen.getByRole("button", { name: "Hopp over" }));

        expect(navigation.push).toHaveBeenCalledWith("/ung/enklere-vei-til-jobb/resultat?v=1");
    });

    it("fullfører uten svar", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();

        render(<OnboardingWizard module={module} />);

        await user.click(screen.getByRole("button", { name: "Neste" }));
        await user.click(screen.getByRole("button", { name: "Neste" }));
        await user.click(screen.getByRole("button", { name: "Fullfør" }));

        expect(navigation.push).toHaveBeenCalledWith("/ung/enklere-vei-til-jobb/resultat?v=1");
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
