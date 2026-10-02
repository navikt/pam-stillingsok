import { BodyLong, Button, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type PageSearchParams, toUrlSearchParams } from "@/app/_common/searchParams/searchParams";
import { buildJobQuizHref, decodeSelectionParams } from "@/features/ung/onboarding/domain/selectionParams";
import { isOnboardingEnabled } from "@/features/ung/onboarding/server/onboardingConfig.server";
import { getSharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";
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
    if (!isOnboardingEnabled()) {
        notFound();
    }

    const source = getSharedContentSource();
    if (!source.ok) {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: source.error.type });
        return <ResultPageError />;
    }

    const moduleResult = await source.data.getOnboardingModule();
    if (!moduleResult.ok) {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: moduleResult.error.type });
        return <ResultPageError />;
    }

    const parsedSelection = decodeSelectionParams(toUrlSearchParams(await searchParams), moduleResult.data);
    if (!parsedSelection.ok) {
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Lenken inneholder ugyldige valg"
                    message="Start på nytt for å velge innhold som passer deg."
                />
            </PageBlock>
        );
    }

    const result = await source.data.getResults(parsedSelection.selection);
    if (!result.ok) {
        appLogger.error("Kunne ikke hente resultater fra Shared Content", { errorType: result.error.type });
        return <ResultPageError />;
    }
    const jobQuizHref = buildJobQuizHref(parsedSelection.selection);

    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <VStack gap={{ xs: "space-24", md: "space-32" }}>
                <Heading level="1" size="xlarge">
                    {result.data.title}
                </Heading>
                <ResultFilters module={moduleResult.data} selection={parsedSelection.selection} />
                <div>
                    <Button as="a" href={jobQuizHref} variant="secondary">
                        Prøv jobbquizen
                    </Button>
                </div>
                <BodyLong size="large">{result.data.intro}</BodyLong>
                {result.data.sections.length > 0 ? (
                    <ResultContent result={result.data} />
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
