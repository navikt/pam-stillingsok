"use client";

import React from "react";
import { BodyLong, Box, Heading, HGrid, Hide, HStack, Link, LocalAlert, Stack } from "@navikt/ds-react";
import GreenFlower from "@/app/sommerjobb/_components/icons/GreenFlower";
import RedFlower from "@/app/sommerjobb/_components/icons/RedFlower";
import SommerjobbStedVelger from "@/app/sommerjobb/_components/SommerjobbStedVelger";
import { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { MuligheterResultData } from "@/app/muligheter/(sok)/_utils/types/MuligheterResultData";
import MuligheterResults from "@/app/muligheter/(sok)/_components/MuligheterResults";
import { LinkIcon } from "@navikt/aksel-icons";
import MuligheterWorkCategory from "@/app/muligheter/(sok)/_components/MuligheterWorkCategory";

interface MuligheterProps {
    data: MuligheterResultData;
    locations: SearchLocation[];
}

function Muligheter({ data, locations }: MuligheterProps) {
    return (
        <Box className="arb-sommerjobb" paddingBlock="space-0 space-96">
            {locations.length < 1 && (
                <Box className="full-width-warning-box">
                    <HStack justify="center">
                        <LocalAlert status="warning">
                            <LocalAlert.Header className="padding-0-75">
                                <LocalAlert.Title>
                                    <BodyLong>Beklager, filteret for sted fungerer ikke akkurat nå</BodyLong>
                                </LocalAlert.Title>
                            </LocalAlert.Header>
                        </LocalAlert>
                    </HStack>
                </Box>
            )}
            <Box paddingBlock={{ xs: "space-0 space-24", md: "space-0 space-48" }} className="container-medium">
                <Stack
                    gap="space-8"
                    justify={{ md: "center" }}
                    align="baseline"
                    paddingBlock={{ xs: "space-16 space-24", md: "space-24" }}
                    className="mb-8"
                >
                    <Stack gap="space-24">
                        <Hide below="md">
                            <span className="arb-sommerjobb-heading-icon-wrapper">
                                <GreenFlower />
                            </span>
                        </Hide>
                        <Heading level="1" size="xlarge">
                            Jobbmulighet
                        </Heading>
                        <Hide below="md">
                            <span className="arb-sommerjobb-heading-icon-wrapper">
                                <RedFlower />
                            </span>
                        </Hide>
                    </Stack>
                    <Heading level="2" size="medium" className="mb-1">
                        For deg som er registrert jobbsøker hos Nav
                    </Heading>
                    <Link href="/muligheter/om-jobbmuligheter" data-color="neutral">
                        Se hvilke fordeler du får som registrert jobbsøker <LinkIcon title="(åpner i denne fanen)" />
                    </Link>
                </Stack>
                <Stack as="section" gap={{ xs: "space-8", md: "space-32" }} direction="column">
                    <MuligheterWorkCategory />
                    <HGrid columns={{ md: 2 }} gap={{ xs: "space-16" }}>
                        <SommerjobbStedVelger locations={locations} />
                    </HGrid>
                </Stack>
            </Box>
            <Box className="muligheter-container" paddingBlock={{ xs: "space-24", md: "space-32" }}>
                <MuligheterResults ads={data.ads} totalAds={data.totalAds} />
            </Box>
        </Box>
    );
}

export default Muligheter;
