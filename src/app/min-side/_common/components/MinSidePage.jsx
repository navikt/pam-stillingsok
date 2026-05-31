"use client";

import { BookmarkIcon, CogIcon, HeartIcon, PersonEnvelopeIcon } from "@navikt/aksel-icons";
import { Box, Button, Heading, HGrid, LinkCard, VStack } from "@navikt/ds-react";
import { LinkCardIcon, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import { PageBlock } from "@navikt/ds-react/Page";
import Link from "next/link";
import { useContext } from "react";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor.tsx";
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
                <PageBlock width="lg" gutters>
                    <Box paddingBlock={{ xs: "8 8", md: "16 16" }}>
                        <Heading level="1" size="xlarge" align="center" className="mb-1">
                            {personalia.data?.navn}
                        </Heading>

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
                                    <LinkCardIcon>
                                        <BookmarkIcon aria-hidden="true" fontSize="2rem" />
                                    </LinkCardIcon>
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor href={`/stillinger/lagrede-sok`}>
                                            Mine lagrede søk
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>

                                <LinkCard className="arb-link-panel-primary">
                                    <LinkCardIcon>
                                        <PersonEnvelopeIcon aria-hidden="true" fontSize="2rem" />
                                    </LinkCardIcon>
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor href="/superrask-soknad/mine-soknader">
                                            Mine søknader
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>

                                <LinkCard className="arb-link-panel-primary">
                                    <LinkCardIcon>
                                        <HeartIcon aria-hidden="true" fontSize="2rem" />
                                    </LinkCardIcon>
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor href={`/stillinger/favoritter`}>
                                            Mine favoritter
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>
                                <LinkCard className="arb-link-panel-primary">
                                    <LinkCardIcon>
                                        <CogIcon aria-hidden="true" fontSize="2rem" />
                                    </LinkCardIcon>
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor href={`/min-side/innstillinger`}>
                                            Samtykker og innstillinger
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                </LinkCard>
                            </HGrid>

                            <KarriereveiledningPanel />
                        </VStack>
                        <Feedback />
                    </Box>
                </PageBlock>
            )}
        </>
    );
}
