import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { isOnboardingEnabled } from "@/features/ung/onboarding/server/onboardingConfig.server";
import { getSharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";
import { OnboardingDataError } from "@/features/ung/onboarding/ui/OnboardingDataError";
import { OnboardingWizard } from "@/features/ung/onboarding/ui/OnboardingWizard";

export const metadata: Metadata = {
    title: "Enklere vei til jobb",
    description: "Svar på noen spørsmål og finn innhold som kan passe situasjonen din.",
    robots: {
        index: false,
        follow: false,
    },
};

export default async function Page() {
    if (!isOnboardingEnabled()) {
        notFound();
    }

    const source = getSharedContentSource();
    if (!source.ok) {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: source.error.type });
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Vi kan ikke vise spørsmålene akkurat nå"
                    message="Prøv igjen senere, eller gå tilbake til ung-sida."
                />
            </PageBlock>
        );
    }

    const moduleResult = await source.data.getOnboardingModule();
    if (!moduleResult.ok) {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: moduleResult.error.type });
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Vi kan ikke vise spørsmålene akkurat nå"
                    message="Prøv igjen senere, eller gå tilbake til ung-sida."
                />
            </PageBlock>
        );
    }

    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <OnboardingWizard module={moduleResult.data} />
        </PageBlock>
    );
}
