"use client";

import React from "react";
import { Alert, Box, Heading, Hide, HStack, Stack } from "@navikt/ds-react";
import SommerjobbResults from "@/app/sommerjobb/_components/SommerjobbResults";
import GreenFlower from "@/app/sommerjobb/_components/icons/GreenFlower";
import RedFlower from "@/app/sommerjobb/_components/icons/RedFlower";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import SommerjobbWorkCategory from "@/app/sommerjobb/_components/SommerjobbWorkCategory";
import SommerjobbDistance from "@/app/sommerjobb/_components/SommerjobbDistance";
import { SommerjobbResultData } from "@/app/sommerjobb/_utils/types/SommerjobbResultData";
import DebugSearch from "@/app/sommerjobb/_components/DebugSearch";

interface SommerjobbProps {
    data: SommerjobbResultData;
    postcodes: Postcode[];
}

function Sommerjobb({ data, postcodes }: SommerjobbProps): JSX.Element {
    return (
        <Box className="arb-sommerjobb" paddingBlock="0 24">
            {postcodes.length < 1 && (
                <Box className="full-width-warning-box">
                    <HStack justify="center">
                        <Alert fullWidth variant="warning">
                            Beklager, filteret for reiseavstand fungerer ikke akkurat nå
                        </Alert>
                    </HStack>
                </Box>
            )}

            <Box paddingBlock={{ xs: "0 6", md: "0 12" }} className="container-large">
                <Stack gap="6" justify={{ md: "center" }} align="baseline" paddingBlock={{ xs: "4 6", md: "10" }}>
                    <Hide below="md">
                        <span className="arb-sommerjobb-heading-icon-wrapper">
                            <GreenFlower />
                        </span>
                    </Hide>
                    <Heading level="1" size="xlarge">
                        Sommerjobben 2025
                    </Heading>
                    <Hide below="md">
                        <span className="arb-sommerjobb-heading-icon-wrapper">
                            <RedFlower />
                        </span>
                    </Hide>
                </Stack>

                <Stack as="section" gap={{ xs: "2", md: "8" }} direction="column">
                    <SommerjobbWorkCategory />
                    <SommerjobbDistance postcodes={postcodes} />
                </Stack>
            </Box>
            <Box background="surface-alt-3-subtle" paddingBlock={{ xs: "6", md: "8" }}>
                <SommerjobbResults result={data.ads} totalAds={data.totalAds} />
            </Box>
            <div className="container-large mt-8">
                <DebugSearch />
            </div>
        </Box>
    );
}

export default Sommerjobb;
