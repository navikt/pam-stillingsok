"use client";

import React from "react";
import { Alert, Box, Heading, Hide, HStack, Stack } from "@navikt/ds-react";
import { SommerjobbResultData } from "@/app/sommerjobb-test/_utils/types/SommerjobbResultData";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import GreenFlower from "@/app/sommerjobb-test/_components/icons/GreenFlower";
import RedFlower from "@/app/sommerjobb-test/_components/icons/RedFlower";
import SommerjobbWorkCategory from "@/app/sommerjobb-test/_components/SommerjobbWorkCategory";
import SommerjobbDistance from "@/app/sommerjobb-test/_components/SommerjobbDistance";
import SommerjobbResults from "@/app/sommerjobb-test/_components/SommerjobbResults";

interface SommerjobbProps {
    data: SommerjobbResultData;
    postcodes: Postcode[];
}

function Sommerjobb({ data, postcodes }: SommerjobbProps): JSX.Element {
    return (
        <Box className="arb-sommerjobb" paddingBlock="space-0 space-96">
            {postcodes.length < 1 && (
                <Box className="full-width-warning-box">
                    <HStack justify="center">
                        <Alert fullWidth variant="warning">
                            Beklager, filteret for reiseavstand fungerer ikke akkurat nå
                        </Alert>
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
                        Sommerjobben {new Date().getFullYear()} - KI tag
                    </Heading>
                    <Hide below="md">
                        <span className="arb-sommerjobb-heading-icon-wrapper">
                            <RedFlower />
                        </span>
                    </Hide>
                </Stack>

                <Stack as="section" gap={{ xs: "space-8", md: "space-32" }} direction="column">
                    <SommerjobbWorkCategory />
                    <SommerjobbDistance postcodes={postcodes} />
                </Stack>
            </Box>
            <Box background="brand-blue-soft" paddingBlock={{ xs: "space-24", md: "space-32" }}>
                <SommerjobbResults result={data.ads} totalAds={data.totalAds} />
            </Box>
        </Box>
    );
}

export default Sommerjobb;
