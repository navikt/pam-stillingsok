"use client";

import React, { useState } from "react";
import { BodyLong, Box, Button, Heading, HStack } from "@navikt/ds-react";
import FinnJobbPanel from "@/features/ung/ui/FinnJobbPanel";
import FigureHalf from "@/features/ung/ui/FigureHalf";

export default function UngMainPage() {
    const [surveyVisible, setSurveyVisible] = useState(true);
    return (
        <>
            <div className="container-large mt-5 mb-9">
                <Heading size="xlarge" level="1" spacing className="jumbo-h1">
                    Er du ung og vil jobbe?
                </Heading>
                <BodyLong size="large" spacing>
                    Vi jobber med å bygge denne siden for unge jobbsøkere!
                    <br /> I 2026 kommer vi med mer nytt innhold som hjelper deg å finne og søke jobb. Følg med!
                </BodyLong>

                <FinnJobbPanel />
            </div>

            <Box className="mb-7 ung-brand-bg-1">
                <div className="container-large">
                    <HStack gap="0 8" align="end">
                        <Box paddingBlock="10" paddingInline="4">
                            <Heading level="2" size="large" className="mb-4">
                                Mer innhold kommer i 2026!
                            </Heading>
                            <BodyLong size="large" className="ung-line-height-large">
                                Arbeidsplassen.no jobber med en helt egen side for unge.
                            </BodyLong>
                        </Box>
                        <HStack justify="end" width={{ xs: "100%", lg: "auto" }}>
                            <FigureHalf />
                        </HStack>
                    </HStack>
                </div>
            </Box>

            {surveyVisible && (
                <Box className="mb-7 ung-brand-bg-2">
                    <div className="container-large">
                        <Box paddingBlock="10" paddingInline="4">
                            <Heading level="2" size="large" className="mb-4">
                                Vil du hjelpe oss å gi innspill til denne siden?
                            </Heading>
                            <BodyLong className="mb-5" size="large">
                                Din tilbakemelding hjelper oss med forbedringer.
                            </BodyLong>
                            <HStack gap="3">
                                <Button size="small">Ja, jeg vil hjelpe</Button>
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
                    </div>
                </Box>
            )}
        </>
    );
}
