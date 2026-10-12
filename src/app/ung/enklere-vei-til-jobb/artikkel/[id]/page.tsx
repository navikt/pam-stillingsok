import { ChevronLeftIcon } from "@navikt/aksel-icons";
import { Bleed, BodyLong, Box, Heading, LocalAlert, VStack } from "@navikt/ds-react";
import { LocalAlertContent, LocalAlertHeader, LocalAlertTitle } from "@navikt/ds-react/LocalAlert";
import { PageBlock } from "@navikt/ds-react/Page";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import { appLogger } from "@/app/_common/logging/appLogger";
import { type PageSearchParams, toUrlSearchParams } from "@/app/_common/searchParams/searchParams";
import { loadArticlePage } from "@/features/ung/onboarding/server/onboardingPageLoaders.server";
import { ArticleContent } from "@/features/ung/onboarding/ui/ArticleContent";
import { ArticleQuiz } from "@/features/ung/onboarding/ui/ArticleQuiz";
import { OnboardingDataError } from "@/features/ung/onboarding/ui/OnboardingDataError";
import styles from "./ArticlePage.module.css";

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
    const { id } = await params;
    const result = await loadArticlePage({
        id,
        query: toUrlSearchParams(await searchParams),
    });
    if (result.type === "not-found") {
        notFound();
    }
    if (result.type === "source-error") {
        appLogger.error("Shared Content-kilden er ikke konfigurert", { errorType: result.errorType });
        return <ArticlePageError backHref={result.backHref} />;
    }
    if (result.type === "module-error") {
        appLogger.error("Kunne ikke hente onboarding fra Shared Content", { errorType: result.errorType });
        return <ArticlePageError backHref={result.backHref} />;
    }
    if (result.type === "invalid-selection") {
        return (
            <PageBlock width="text" gutters className="mt-responsive mb-responsive">
                <OnboardingDataError
                    title="Lenken inneholder ugyldige valg"
                    message="Start på nytt for å velge innhold som passer deg."
                    backHref={result.backHref}
                    backLabel="Start på nytt"
                />
            </PageBlock>
        );
    }
    if (result.type === "article-error") {
        appLogger.error("Kunne ikke hente artikkel fra Shared Content", { errorType: result.errorType });
        return <ArticlePageError backHref={result.backHref} />;
    }

    if (result.quiz.type === "error") {
        appLogger.error("Kunne ikke hente artikkelquiz fra Shared Content", { errorType: result.quiz.errorType });
    }

    const { article, backHref } = result;

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
                            <ArticleContent blocks={article.blocks} articleSlug={article.id} />
                            {result.quiz.type === "success" && <ArticleQuiz quiz={result.quiz.quiz} />}
                            {result.quiz.type === "error" && (
                                <LocalAlert status="warning" as="section" aria-labelledby="artikkel-quiz-feil">
                                    <LocalAlertHeader>
                                        <LocalAlertTitle id="artikkel-quiz-feil" as="h2">
                                            Vi kan ikke vise quizen akkurat nå
                                        </LocalAlertTitle>
                                    </LocalAlertHeader>
                                    <LocalAlertContent>Prøv igjen senere.</LocalAlertContent>
                                </LocalAlert>
                            )}
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
