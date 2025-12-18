"use client";

import React, { useState } from "react";
import { BodyLong, Box, Button, Heading, HStack } from "@navikt/ds-react";
import FinnJobbPanel from "@/features/ung/ui/FinnJobbPanel";
import FigureHalf from "@/features/ung/ui/FigureHalf";
import SkyraSurvey from "@/app/_common/skyra/SkyraSurvey";
import { PageBlock } from "@navikt/ds-react/Page";

export default function UngMainPage() {
    const [surveyVisible, setSurveyVisible] = useState(true);
    return (
        <>
            <PageBlock width="2xl" gutters className="mt-5 mb-9">
                <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                    Er du ung og vil jobbe?
                </Heading>
                <BodyLong size="large" spacing>
                    Vi lager en egen side for deg som er ung og vil ut i jobb. Her får du tips og hjelp til å finne
                    mulighetene som passer for deg
                </BodyLong>
            </PageBlock>

            <Box className="mb-7 ung-brand-bg-1">
                <PageBlock width="2xl" gutters>
                    <HStack align="end">
                        <Box paddingBlock="10" paddingInline="4" maxWidth="650px">
                            <Heading level="2" size="large" className="mb-4">
                                Mer innhold kommer i 2026!
                            </Heading>
                            <BodyLong size="large" className="ung-line-height-large">
                                I 2026 kommer vi med mer nytt innhold som hjelper deg å finne og søke jobb. Følg med!
                            </BodyLong>
                        </Box>
                        <HStack justify="end" width={{ xs: "100%", lg: "auto" }}>
                            <FigureHalf />
                        </HStack>
                    </HStack>
                </PageBlock>
            </Box>

            <PageBlock width="2xl" gutters className="mb-8">
                <FinnJobbPanel />
            </PageBlock>

            {surveyVisible && (
                <Box className="ung-brand-bg-2">
                    <PageBlock width="2xl" gutters>
                        <Box paddingBlock="10" paddingInline="4">
                            <Heading level="2" size="large" className="mb-4">
                                Vil du gi oss innspill til hva siden skal inneholde?
                            </Heading>
                            <BodyLong className="mb-5" size="large">
                                Svar på undersøkelsen her.
                            </BodyLong>
                            <HStack gap="3">
                                <SkyraSurvey
                                    buttonSize="small"
                                    buttonVariant="primary"
                                    buttonText="Ja, jeg vil gi innspill"
                                    skyraSlug="arbeids-og-velferdsetaten-nav/tilbakemelding-arbeidsplassen-ung"
                                />
                                <Button
                                    size="small"
                                    variant="secondary"
                                    onClick={() => {
                                        setSurveyVisible(false);
                                    }}
                                >
                                    Nei takk
                                </Button>
                            </HStack>
                        </Box>
                    </PageBlock>
                </Box>
            )}
        </>
    );
}
