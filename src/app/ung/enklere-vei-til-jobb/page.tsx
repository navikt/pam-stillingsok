import { VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { loadStartPage } from "@/features/ung/onboarding/server/onboardingPageLoaders.server";
import { ArticleContent } from "@/features/ung/onboarding/ui/ArticleContent";
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
    const result = await loadStartPage();
    if (result.type === "not-found") {
        notFound();
    }

    if (result.type === "source-error") {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: result.errorType });
    }
    if (result.type === "module-error") {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: result.errorType });
    }
    if (result.type !== "success") {
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
            <VStack gap={{ xs: "space-24", md: "space-40" }}>
                <OnboardingWizard module={result.module} />
                {result.module.blocks.length > 0 && <ArticleContent blocks={result.module.blocks} />}
            </VStack>
        </PageBlock>
    );
}
