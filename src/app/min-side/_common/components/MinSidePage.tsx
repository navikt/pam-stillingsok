"use client";

import { Box, Button, Heading, LinkCard, Stack, VStack } from "@navikt/ds-react";
import { CogIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import React, { useContext } from "react";
import { PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import ErrorPage from "@/app/min-side/_common/components/ErrorPage";
import Feedback from "@/app/min-side/_common/components/Feedback";
import KarriereveiledningPanel from "./Karriereveiledning";
import { PageBlock } from "@navikt/ds-react/Page";
import { LinkCardDescription, LinkCardTitle } from "@navikt/ds-react/LinkCard";
import AkselNextLinkCardAnchor from "@/app/_common/components/AkselNextLinkCardAnchor/AkselNextLinkCardAnchor";

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
                    <Box paddingBlock={{ xs: "space-32", md: "space-64" }}>
                        <Heading level="1" size="xlarge" align="center" className="mb-1">
                            {personalia.data && personalia.data.navn}
                        </Heading>

                        <VStack align="center" className="mb-8">
                            <Button
                                variant="tertiary"
                                as={Link}
                                href="/min-side/innstillinger"
                                icon={<CogIcon aria-hidden="true" fontSize="1.5rem" />}
                            >
                                Samtykker og innstillinger
                            </Button>
                        </VStack>

                        <VStack gap="space-16" className="mb-14">
                            <Stack gap="space-16" direction={{ xs: "column", md: "row" }}>
                                <LinkCard className="arb-link-panel-primary flex-1">
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor href={`/stillinger/lagrede-sok`}>
                                            Mine lagrede søk
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                    <LinkCardDescription>
                                        Bruk et lagret søk for å finne stillinger, eller slett varsel på søk du ikke
                                        bruker.
                                    </LinkCardDescription>
                                </LinkCard>

                                <LinkCard className="arb-link-panel-primary flex-1">
                                    <LinkCardTitle>
                                        <AkselNextLinkCardAnchor href={`/stillinger/favoritter`}>
                                            Mine favoritter
                                        </AkselNextLinkCardAnchor>
                                    </LinkCardTitle>
                                    <LinkCardDescription>
                                        Vis alle annonser du har lagret som favoritter.
                                    </LinkCardDescription>
                                </LinkCard>
                            </Stack>

                            <KarriereveiledningPanel />
                        </VStack>
                        <Feedback />
                    </Box>
                </PageBlock>
            )}
        </>
    );
}
