import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { Bleed, BodyLong, Box, Heading, LocalAlert, VStack } from "@navikt/ds-react";
import { LocalAlertContent, LocalAlertHeader, LocalAlertTitle } from "@navikt/ds-react/LocalAlert";
import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { z } from "zod";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type PageSearchParams, toUrlSearchParams } from "@/app/_common/searchParams/searchParams";
import type { Selection } from "@/features/ung/onboarding/domain/onboarding";
import { buildResultHref, decodeSelectionParams } from "@/features/ung/onboarding/domain/selectionParams";
import { isOnboardingEnabled } from "@/features/ung/onboarding/server/onboardingConfig.server";
import { getSharedContentSource } from "@/features/ung/onboarding/server/sharedContentSource.server";
import { ArticleContent } from "@/features/ung/onboarding/ui/ArticleContent";
import { ArticleMetadataDebugPanel } from "@/features/ung/onboarding/ui/ArticleMetadataDebugPanel";
import { ArticleQuiz } from "@/features/ung/onboarding/ui/ArticleQuiz";
import { OnboardingDataError } from "@/features/ung/onboarding/ui/OnboardingDataError";
import styles from "./ArticlePage.module.css";

const START_PATH = "/ung/enklere-vei-til-jobb";

export const metadata: Metadata = {
    title: "Artikkel",
    robots: {
        index: false,
        follow: false,
    },
};

type ArticlePageProps = Readonly<{
    params: Promise<{ id: string }>;
    searchParams: Promise<PageSearchParams>;
}>;

export default async function Page({ params, searchParams }: ArticlePageProps) {
    if (!isOnboardingEnabled()) {
        notFound();
    }

    const { id } = await params;
    if (!z.uuid().safeParse(id).success) {
        notFound();
    }

    const source = getSharedContentSource();
    if (!source.ok) {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: source.error.type });
        return <ArticlePageError backHref={START_PATH} />;
    }

    const urlSearchParams = toUrlSearchParams(await searchParams);
    let selection: Selection | undefined;
    if (urlSearchParams.has("v") || urlSearchParams.has("svar")) {
        const moduleResult = await source.data.getOnboardingModule();
        if (!moduleResult.ok) {
            appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: moduleResult.error.type });
            return <ArticlePageError backHref={START_PATH} />;
        }
        const parsedSelection = decodeSelectionParams(urlSearchParams, moduleResult.data);
        if (!parsedSelection.ok) {
            return (
                <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                    <OnboardingDataError
                        title="Lenken inneholder ugyldige valg"
                        message="Start på nytt for å velge innhold som passer deg."
                        backHref={START_PATH}
                        backLabel="Start på nytt"
                    />
                </PageBlock>
            );
        }
        selection = parsedSelection.selection;
    }
    const backHref = selection ? buildResultHref(selection) : START_PATH;

    const articleResult = await source.data.getArticle(id);
    if (!articleResult.ok) {
        if (articleResult.error.type === "not-found") {
            notFound();
        }
        appLogger.error("Kunne ikke hente artikkel fra Shared Content", { errorType: articleResult.error.type });
        return <ArticlePageError backHref={backHref} />;
    }
    const article = articleResult.data;

    const quizResult = article.webformId ? await source.data.getArticleQuiz(article.webformId) : undefined;
    if (quizResult && !quizResult.ok) {
        appLogger.error("Kunne ikke hente artikkelquiz fra Shared Content", { errorType: quizResult.error.type });
    }

    return (
        <>
            <PageBlock width="text" gutters className="mt-responsive">
                <AkselNextLink href={backHref}>
                    <ChevronLeftIcon aria-hidden fontSize="1.6rem" />
                    Tilbake til resultater
                </AkselNextLink>
            </PageBlock>
            <Bleed marginInline="full" asChild>
                <Box as="div" className={styles.background}>
                    <PageBlock as="article" width="text" gutters className="mb-responsive">
                        <VStack
                            gap={{ xs: "space-24", md: "space-32" }}
                            paddingBlock={{ xs: "space-24", md: "space-32" }}
                        >
                            <VStack gap="space-12">
                                <Heading level="1" size="xlarge">
                                    {article.title}
                                </Heading>
                                {article.intro && <BodyLong size="large">{article.intro}</BodyLong>}
                            </VStack>
                            <ArticleContent blocks={article.blocks} />
                            {quizResult?.ok && <ArticleQuiz quiz={quizResult.data} />}
                            {quizResult && !quizResult.ok && (
                                <LocalAlert status="warning" as="section" aria-labelledby="artikkel-quiz-feil">
                                    <LocalAlertHeader>
                                        <LocalAlertTitle id="artikkel-quiz-feil" as="h2">
                                            Vi kan ikke vise quizen akkurat nå
                                        </LocalAlertTitle>
                                    </LocalAlertHeader>
                                    <LocalAlertContent>Prøv igjen senere.</LocalAlertContent>
                                </LocalAlert>
                            )}
                            {article.metadataNames && <ArticleMetadataDebugPanel metadata={article.metadataNames} />}
                        </VStack>
                    </PageBlock>
                </Box>
            </Bleed>
        </>
    );
}

function ArticlePageError({ backHref }: Readonly<{ backHref: string }>) {
    return (
        <PageBlock width="text" gutters className="mt-responsive mb-responsive">
            <OnboardingDataError
                title="Vi kan ikke vise artikkelen akkurat nå"
                message="Prøv igjen senere, eller gå tilbake til resultatsida."
                backHref={backHref}
                backLabel="Tilbake til resultater"
            />
        </PageBlock>
    );
}
