import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type PageSearchParams, toUrlSearchParams } from "@/app/_common/searchParams/searchParams";
import { loadJobQuizPage } from "@/features/ung/enklere-vei-til-jobb/server/onboardingPageLoaders.server";
import { JobQuiz } from "@/features/ung/enklere-vei-til-jobb/ui/JobQuiz";
import { OnboardingDataError } from "@/features/ung/enklere-vei-til-jobb/ui/OnboardingDataError";

export const metadata: Metadata = {
    title: "Jobbquizen",
    description: "Test hva du kan om jobbsøking.",
    robots: {
        index: false,
        follow: false,
    },
};

type JobQuizPageProps = Readonly<{
    searchParams: Promise<PageSearchParams>;
}>;

export default async function Page({ searchParams }: JobQuizPageProps) {
    const urlSearchParams = toUrlSearchParams(await searchParams);
    const result = await loadJobQuizPage(urlSearchParams);
    if (result.type === "not-found") {
        notFound();
    }
    if (result.type === "source-error") {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: result.errorType });
        return <JobQuizPageError backHref={result.backHref} />;
    }
    if (result.type === "module-error") {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: result.errorType });
        return <JobQuizPageError backHref={result.backHref} />;
    }
    if (result.type === "quiz-error") {
        appLogger.error("Kunne ikke hente jobbquiz fra Shared Content", { errorType: result.errorType });
        return <JobQuizPageError backHref={result.backHref} />;
    }
    if (result.type === "invalid-selection") {
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Lenken til jobbquizen er ugyldig"
                    message="Gå tilbake til resultatsida og åpne quizen på nytt."
                    backHref={result.backHref}
                    backLabel="Tilbake til resultater"
                />
            </PageBlock>
        );
    }

    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <JobQuiz quiz={result.quiz} backHref={result.backHref} />
        </PageBlock>
    );
}

function JobQuizPageError({ backHref }: Readonly<{ backHref: string }>) {
    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <OnboardingDataError
                title="Vi kan ikke vise jobbquizen akkurat nå"
                message="Prøv igjen senere, eller gå tilbake til resultatsida."
                backHref={backHref}
                backLabel="Tilbake til resultater"
            />
        </PageBlock>
    );
}
