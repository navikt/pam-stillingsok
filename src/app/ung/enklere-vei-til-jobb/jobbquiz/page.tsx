import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type PageSearchParams, toUrlSearchParams } from "@/app/_common/searchParams/searchParams";
import { buildResultHref, decodeSelectionParams } from "@/features/ung/onboarding/domain/selectionParams";
import { isOnboardingEnabled } from "@/features/ung/onboarding/server/onboardingConfig.server";
import { getSharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";
import { JobQuiz } from "@/features/ung/onboarding/ui/JobQuiz";
import { OnboardingDataError } from "@/features/ung/onboarding/ui/OnboardingDataError";

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
    if (!isOnboardingEnabled()) {
        notFound();
    }

    const source = getSharedContentSource();
    if (!source.ok) {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: source.error.type });
        return <JobQuizPageError backHref={buildResultHref({ answerIds: [] })} />;
    }

    const [moduleResult, quizResult] = await Promise.all([source.data.getOnboardingModule(), source.data.getJobQuiz()]);
    if (!moduleResult.ok) {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: moduleResult.error.type });
        return <JobQuizPageError backHref={buildResultHref({ answerIds: [] })} />;
    }
    if (!quizResult.ok) {
        appLogger.error("Kunne ikke hente jobbquiz fra Shared Content", { errorType: quizResult.error.type });
        return <JobQuizPageError backHref={buildResultHref({ answerIds: [] })} />;
    }

    const urlSearchParams = toUrlSearchParams(await searchParams);
    const selectionResult =
        urlSearchParams.toString().length === 0
            ? ({ ok: true, selection: { answerIds: [] } } as const)
            : decodeSelectionParams(urlSearchParams, moduleResult.data);
    if (!selectionResult.ok) {
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Lenken til jobbquizen er ugyldig"
                    message="Gå tilbake til resultatsida og åpne quizen på nytt."
                    backHref={buildResultHref({ answerIds: [] })}
                    backLabel="Tilbake til resultater"
                />
            </PageBlock>
        );
    }

    const backHref = buildResultHref(selectionResult.selection);

    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <JobQuiz quiz={quizResult.data} backHref={backHref} />
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
