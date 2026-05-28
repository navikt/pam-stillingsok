"use client";

import { CogIcon } from "@navikt/aksel-icons";
import { BodyLong, Button, HGrid, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import Link from "next/link";
import { useContext } from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor.tsx";
import MinSidePageWrapper from "@/app/_common/min-side/MinSidePageWrapper.js";
import { PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import ErrorPage from "@/app/min-side/_common/components/ErrorPage";
import Feedback from "@/app/min-side/_common/components/Feedback";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import KarriereveiledningPanel from "./Karriereveiledning";

/**
 * TODO: konverter til ts
 */
export default function MinSidePage() {
    const personalia = useContext(PersonaliaContext);

    if (personalia.status === "error") {
        return <ErrorPage />;
    }

    return (
        <>
            {personalia.status === "not-fetched" || personalia.status === "pending" ? (
                <div className="text-center">
                    <LoadingPage />
                </div>
            ) : (
                <MinSidePageWrapper title="Min side">
                    <BodyLong size="large" align="center" className="mb-4">
                        {personalia.data?.navn}
                    </BodyLong>

                    <VStack align="center" className="mb-8">
                        <Button
                            variant="tertiary"
                            as={Link}
                            href="/min-side/innstillinger"
                            prefetch={false}
                            icon={<CogIcon aria-hidden="true" fontSize="1.5rem" />}
                        >
                            Samtykker og innstillinger
                        </Button>
                    </VStack>

                    <VStack gap="space-16" className="mb-14">
                        <HGrid columns={{ xs: 1, md: 2 }} gap="space-16">
                            <LinkCard className="arb-link-panel-primary">
                                <LinkCardTitle>
                                    <AkselNextLinkCardAnchor href={`/stillinger/lagrede-sok`}>
                                        Mine lagrede søk
                                    </AkselNextLinkCardAnchor>
                                </LinkCardTitle>
                                <LinkCardDescription>
                                    Bruk et lagret søk for å finne stillinger, eller slett varsel på søk du ikke bruker.
                                </LinkCardDescription>
                            </LinkCard>

                            <LinkCard className="arb-link-panel-primary">
                                <LinkCardTitle>
                                    <AkselNextLinkCardAnchor href="/superrask-soknad/mine-soknader">
                                        Mine søknader
                                    </AkselNextLinkCardAnchor>
                                </LinkCardTitle>
                                <LinkCardDescription>
                                    Jobbene du har søkt på med superrask søknad finner du her.
                                </LinkCardDescription>
                            </LinkCard>

                            <LinkCard className="arb-link-panel-primary">
                                <LinkCardTitle>
                                    <AkselNextLinkCardAnchor href={`/stillinger/favoritter`}>
                                        Mine favoritter
                                    </AkselNextLinkCardAnchor>
                                </LinkCardTitle>
                                <LinkCardDescription>
                                    Vis alle annonser du har lagret som favoritter.
                                </LinkCardDescription>
                            </LinkCard>
                        </HGrid>

                        <KarriereveiledningPanel />
                    </VStack>
                    <Feedback />
                </MinSidePageWrapper>
            )}
        </>
    );
}
