import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import runAxeTest from "@/app/_common/axe/runAxeTest";
import type { OnboardingModule, Selection } from "@/features/ung/onboarding/domain/onboarding";
import { encodeSelectionParams } from "@/features/ung/onboarding/domain/selectionParams";
import {
    MOCK_AGE_18_OR_OLDER,
    MOCK_AGE_UNDER_18,
    MOCK_EXPERIENCE_NONE,
    MOCK_GOAL_FIND_JOB,
    MOCK_GOAL_INTERVIEW,
} from "@/features/ung/onboarding/server/mock/mockOnboardingWebform";
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

function expectedHref(module: OnboardingModule, selection: Selection) {
    const searchParams = encodeSelectionParams(selection, module);
    return `/ung/enklere-vei-til-jobb/resultat?${searchParams.toString()}`;
}

describe("ResultFilters", () => {
    beforeEach(() => {
        navigation.replace.mockClear();
    });

    it("viser URL-valgene og oppdaterer innholdet med en gang et valg endres", async () => {
        const user = userEvent.setup();
        const module = await getOnboardingModule();
        const initialSelection: Selection = {
            age: { dimension: "age", optionIds: [MOCK_AGE_UNDER_18] },
            goals: { dimension: "audiences", optionIds: [MOCK_GOAL_FIND_JOB] },
        };

        const { rerender } = render(<ResultFilters module={module} selection={initialSelection} />);

        const ageSelect = screen.getByRole("combobox", { name: "Hvor gammel er du?" });
        expect(ageSelect).toHaveValue(MOCK_AGE_UNDER_18);

        await user.selectOptions(ageSelect, MOCK_AGE_18_OR_OLDER);
        await waitFor(() =>
            expect(navigation.replace).toHaveBeenLastCalledWith(
                expectedHref(module, {
                    age: { dimension: "age", optionIds: [MOCK_AGE_18_OR_OLDER] },
                    goals: { dimension: "audiences", optionIds: [MOCK_GOAL_FIND_JOB] },
                }),
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
                expectedHref(module, {
                    age: { dimension: "age", optionIds: [MOCK_AGE_18_OR_OLDER] },
                    goals: { dimension: "audiences", optionIds: [] },
                }),
                { scroll: false },
            ),
        );

        const interview = screen.getByRole("checkbox", { name: "Forberede meg til intervju" });
        await user.click(interview);
        expect(interview).toBeChecked();

        await waitFor(() =>
            expect(navigation.replace).toHaveBeenLastCalledWith(
                expectedHref(module, {
                    age: { dimension: "age", optionIds: [MOCK_AGE_18_OR_OLDER] },
                    goals: { dimension: "audiences", optionIds: [MOCK_GOAL_INTERVIEW] },
                }),
                { scroll: false },
            ),
        );
        expect(navigation.replace).toHaveBeenCalledTimes(3);

        rerender(
            <ResultFilters
                module={module}
                selection={{
                    age: { dimension: "age", optionIds: [MOCK_AGE_18_OR_OLDER] },
                    goals: { dimension: "audiences", optionIds: [MOCK_GOAL_INTERVIEW] },
                }}
            />,
        );

        expect(interview).toBeChecked();
        expect(navigation.replace).toHaveBeenCalledTimes(3);
    });

    it("bruker første alternativ som standard og tillater ikke å velge bort svaret", async () => {
        const module = await getOnboardingModule();

        render(<ResultFilters module={module} selection={{}} />);

        const ageSelect = screen.getByRole("combobox", { name: "Hvor gammel er du?" });
        expect(ageSelect).toHaveValue(MOCK_AGE_UNDER_18);
        expect(screen.queryByRole("option", { name: "Ingen valgt" })).not.toBeInTheDocument();

        const experienceSelect = screen.getByRole("combobox", { name: "Hva er din situasjon nå?" });
        expect(experienceSelect).toHaveValue(MOCK_EXPERIENCE_NONE);
    });

    it("har ingen automatiske UU-feil", async () => {
        const module = await getOnboardingModule();
        const { container } = render(<ResultFilters module={module} selection={{}} />);

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
