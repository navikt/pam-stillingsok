"use client";

import React from "react";
import { BodyLong, Box, Heading, Hide, HStack, LocalAlert, Stack } from "@navikt/ds-react";
import SommerjobbResults from "@/app/sommerjobb/_components/SommerjobbResults";
import GreenFlower from "@/app/sommerjobb/_components/icons/GreenFlower";
import RedFlower from "@/app/sommerjobb/_components/icons/RedFlower";
import SommerjobbWorkCategory from "@/app/sommerjobb/_components/SommerjobbWorkCategory";
import SommerjobbStedVelger from "@/app/sommerjobb/_components/SommerjobbStedVelger";
import { SommerjobbResultData } from "@/app/sommerjobb/_utils/types/SommerjobbResultData";
import { SearchLocation } from "@/app/_common/geografi/locationsMapping";

interface SommerjobbProps {
    data: SommerjobbResultData;
    locations: SearchLocation[];
}

function Sommerjobb({ data, locations }: SommerjobbProps) {
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
            <Box paddingBlock={{ xs: "space-0 space-24", md: "space-0 space-48" }} className="container-large">
                <Stack
                    gap="space-24"
                    justify={{ md: "center" }}
                    align="baseline"
                    paddingBlock={{ xs: "space-16 space-24", md: "space-40" }}
                >
                    <Hide below="md">
                        <span className="arb-sommerjobb-heading-icon-wrapper">
                            <GreenFlower />
                        </span>
                    </Hide>
                    <Heading level="1" size="xlarge">
                        Sommerjobben {new Date().getFullYear()}
                    </Heading>
                    <Hide below="md">
                        <span className="arb-sommerjobb-heading-icon-wrapper">
                            <RedFlower />
                        </span>
                    </Hide>
                </Stack>

                <Stack as="section" gap={{ xs: "space-8", md: "space-32" }} direction="column">
                    <SommerjobbWorkCategory />
                    <SommerjobbStedVelger locations={locations} />
                </Stack>
            </Box>
            <Box className="bg-brand-peach-subtle" paddingBlock={{ xs: "space-24", md: "space-32" }}>
                <SommerjobbResults ads={data.ads} totalAds={data.totalAds} totalStillinger={data.totalStillinger} />
            </Box>
        </Box>
    );
}

export default Sommerjobb;
