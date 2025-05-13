"use client";

import { Box, Button, Heading, LinkPanel, Stack, VStack } from "@navikt/ds-react";
import { CogIcon } from "@navikt/aksel-icons";
import Link from "next/link";
import { useContext } from "react";
import { PersonaliaContext } from "@/app/min-side/_common/components/context/PersonaliaContext";
import LoadingPage from "@/app/min-side/_common/components/LoadingPage";
import ErrorPage from "@/app/min-side/_common/components/ErrorPage";
import Feedback from "@/app/min-side/_common/components/Feedback";
import KarriereveiledningPanel from "./Karriereveiledning";

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
                <Box paddingBlock={{ xs: "8 8", md: "16 16" }} className="container-medium">
                    <Heading level="1" size="xlarge" align="center" className="mb-1">
                        {personalia.data && personalia.data.navn}
                    </Heading>
                    Ola tester versjon
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
                    <VStack gap="4" className="mb-14">
                        <Stack gap="4" direction={{ xs: "column", md: "row" }}>
                            <LinkPanel
                                href={`/stillinger/lagrede-sok`}
                                className="arb-link-panel-primary flex flex-1 align-normal"
                            >
                                <LinkPanel.Title>Mine lagrede søk</LinkPanel.Title>
                                <LinkPanel.Description>
                                    Bruk et lagret søk for å finne stillinger, eller slett varsel på søk du ikke bruker.
                                </LinkPanel.Description>
                            </LinkPanel>
                            <LinkPanel
                                href={`/stillinger/favoritter`}
                                className="arb-link-panel-primary flex flex-1 align-normal"
                            >
                                <LinkPanel.Title>Mine favoritter</LinkPanel.Title>
                                <LinkPanel.Description>
                                    Vis alle annonser du har lagret som favoritter.
                                </LinkPanel.Description>
                            </LinkPanel>
                        </Stack>
                        <LinkPanel href={`/cv?v1`} className="arb-link-panel-secondary">
                            <LinkPanel.Title>Min CV</LinkPanel.Title>
                            <LinkPanel.Description>
                                Fyll ut og hold din CV oppdatert for å bruke den ved jobbsøking.
                            </LinkPanel.Description>
                        </LinkPanel>

                        <KarriereveiledningPanel />
                    </VStack>
                    <Feedback />
                </Box>
            )}
        </>
    );
}
