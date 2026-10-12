import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type PageSearchParams, toUrlSearchParams } from "@/app/_common/searchParams/searchParams";
import { loadResultsPage } from "@/features/ung/onboarding/server/onboardingPageLoaders.server";
import { OnboardingDataError } from "@/features/ung/onboarding/ui/OnboardingDataError";
import { ResultContent } from "@/features/ung/onboarding/ui/ResultContent";
import { ResultFilters } from "@/features/ung/onboarding/ui/ResultFilters";

export const metadata: Metadata = {
    title: "Jobb for deg",
    description: "Stillinger, råd og tips som kan passe situasjonen din.",
    robots: {
        index: false,
        follow: false,
    },
};

type ResultPageProps = Readonly<{
    searchParams: Promise<PageSearchParams>;
}>;

export default async function Page({ searchParams }: ResultPageProps) {
    const page = await loadResultsPage(toUrlSearchParams(await searchParams));
    if (page.type === "not-found") {
        notFound();
    }

    if (page.type === "source-error") {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: page.errorType });
        return <ResultPageError />;
    }
    if (page.type === "module-error") {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: page.errorType });
        return <ResultPageError />;
    }
    if (page.type === "invalid-selection") {
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Lenken inneholder ugyldige valg"
                    message="Start på nytt for å velge innhold som passer deg."
                />
            </PageBlock>
        );
    }
    if (page.type === "results-error") {
        appLogger.error("Kunne ikke hente resultater fra Shared Content", { errorType: page.errorType });
        return <ResultPageError />;
    }

    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <VStack gap={{ xs: "space-24", md: "space-32" }}>
                <Heading level="1" size="xlarge">
                    {page.result.title}
                </Heading>
                <ResultFilters module={page.module} selection={page.selection} />
                <div>
                    <Button as="a" href={page.jobQuizHref} variant="secondary">
                        Prøv jobbquizen
                    </Button>
                </div>
                <BodyLong size="large">{page.result.intro}</BodyLong>
                {page.result.sections.length > 0 ? (
                    <ResultContent result={page.result} />
                ) : (
                    <OnboardingDataError
                        title="Vi fant ikke innhold for valgene dine"
                        message="Juster valgene og prøv igjen."
                        headingLevel="2"
                    />
                )}
            </VStack>
        </PageBlock>
    );
}

function ResultPageError() {
    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <OnboardingDataError
                title="Vi kan ikke vise innholdet akkurat nå"
                message="Prøv igjen senere, eller gå tilbake til ung-sida."
            />
        </PageBlock>
    );
}
