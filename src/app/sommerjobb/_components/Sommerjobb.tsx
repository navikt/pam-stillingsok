"use client";

import React from "react";
import { Box, Heading, Hide, HStack, VStack } from "@navikt/ds-react";
import SommerjobbFilter from "@/app/sommerjobb/_components/SommerjobbFilter";
import SommerjobbResults from "@/app/sommerjobb/_components/SommerjobbResults";
import GreenFlower from "@/app/_common/icons/GreenFlower";
import RedFlower from "@/app/_common/icons/RedFlower";
import { Postcode } from "@/app/(sok)/_utils/fetchPostcodes";

export interface SommerjobbAd {
    uuid: string;
    title: string;
    description: string;
    employerName: string;
    location: string;
    applicationDueDate: string;
}

interface SommerjobbProps {
    postcodes: Postcode[];
    result: SommerjobbAd[];
}

function Sommerjobb({ postcodes, result }: SommerjobbProps): JSX.Element {
    return (
        <VStack gap="10" className="mt-10 mb-24">
            <VStack align="center" className="container-large">
                <HStack gap="6" align="center" className="mb-10">
                    <Hide below="md">
                        <GreenFlower />
                    </Hide>
                    <Heading level="1" size="xlarge">
                        Sommerjobben 2025
                    </Heading>
                    <Hide below="md">
                        <RedFlower />
                    </Hide>
                </HStack>
                <Box maxWidth="800px">
                    <SommerjobbFilter postcodes={postcodes} />
                </Box>
            </VStack>
            <Box background="surface-alt-3-subtle" paddingBlock="8">
                <div className="container-large">
                    <SommerjobbResults result={result} />
                </div>
            </Box>
        </VStack>
    );
}

export default Sommerjobb;
