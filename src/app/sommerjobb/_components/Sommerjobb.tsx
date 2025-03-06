"use client";

import React from "react";
import { Alert, Bleed, Box, Heading, Hide, Stack } from "@navikt/ds-react";
import SommerjobbResults, { SommerjobbAd } from "@/app/sommerjobb/_components/SommerjobbResults";
import GreenFlower from "@/app/stillinger/_common/icons/GreenFlower";
import RedFlower from "@/app/stillinger/_common/icons/RedFlower";
import { Postcode } from "@/app/stillinger/_utils/fetchPostcodes";
import SommerjobbWorkCategory from "@/app/sommerjobb/_components/SommerjobbWorkCategory";
import SommerjobbDistance from "@/app/sommerjobb/_components/SommerjobbDistance";

interface SommerjobbResultData {
    ads: SommerjobbAd[];
    totalAds: number;
}

interface SommerjobbProps {
    data: SommerjobbResultData;
    postcodes: Postcode[];
}

function Sommerjobb({ data, postcodes }: SommerjobbProps): JSX.Element {
    return (
        <Box paddingBlock="0 24">
            {postcodes.length < 1 && (
                <Bleed marginInline="full">
                    <Box className="full-width-warning-box">
                        <Stack align="center" justify="center">
                            <Alert fullWidth variant="warning">
                                Beklager, filteret for reiseavstand fungerer ikke akkurat nå
                            </Alert>
                        </Stack>
                    </Box>
                </Bleed>
            )}

            <Box paddingBlock={{ xs: "0 6", md: "0 12" }} className="container-large">
                <Stack gap="6" justify={{ md: "center" }} paddingBlock={{ xs: "4 6", md: "10" }}>
                    <Hide below="md">
                        <GreenFlower />
                    </Hide>
                    <Heading level="1" size="xlarge">
                        Sommerjobben 2025
                    </Heading>
                    <Hide below="md">
                        <RedFlower />
                    </Hide>
                </Stack>
                <Stack as="section" aria-label="Ditt søk" gap={{ xs: "2", md: "8" }} direction="column">
                    <SommerjobbWorkCategory />
                    <SommerjobbDistance postcodes={postcodes} />
                </Stack>
            </Box>
            <Box background="surface-alt-3-subtle" paddingBlock={{ xs: "6", md: "8" }}>
                <div className="container-large">
                    <SommerjobbResults result={data.ads} totalAds={data.totalAds} />
                </div>
            </Box>
        </Box>
    );
}

export default Sommerjobb;
