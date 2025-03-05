"use client";

import React, { useId } from "react";
import { Heading, HGrid, Stack, VStack } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";
import SommerjobbPagination from "@/app/sommerjobb/_components/SommerjobbPagination";
import ExtendDistanceButton from "@/app/sommerjobb/_components/ExtendDistanceButton";
import { formatNumber } from "@/app/_common/utils/utils";

export interface SommerjobbAd {
    uuid: string;
    title: string;
    description: string;
    employerName: string;
    location: string;
    applicationDue: string;
}

interface SommerjobbResultsProps {
    result: SommerjobbAd[];
    totalAds: number;
}

function SommerjobbResults({ result, totalAds }: SommerjobbResultsProps): JSX.Element {
    const resultsId = useId();
    return (
        <Stack justify={{ md: "center" }} as="section" gap={{ xs: "6", md: "8" }} aria-labelledby={resultsId}>
            <Stack justify={{ md: "center" }}>
                <Heading id={resultsId} level="2" size="large" aria-live="polite">
                    {totalAds > 0
                        ? `Vi fant ${formatNumber(totalAds)} sommerjobber!`
                        : "Vi fant ingen sommerjobber som matcher valgene dine"}
                </Heading>
            </Stack>
            {totalAds > 0 ? (
                <>
                    <HGrid gap="4" columns={{ xs: 1, md: 2 }}>
                        {result.map((item) => (
                            <SommerjobbItem key={item.uuid} sommerjobbAd={item} />
                        ))}
                    </HGrid>
                    <VStack align="center" width="100%">
                        <SommerjobbPagination totalAds={totalAds} />
                    </VStack>
                </>
            ) : (
                <ExtendDistanceButton />
            )}
        </Stack>
    );
}

export default SommerjobbResults;
