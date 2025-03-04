"use client";

import React, { useId } from "react";
import { Heading, HGrid, HStack, VStack } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";
import SommerjobbPaginering from "@/app/sommerjobb/_components/SommerjobbPaginering";
import UtvidReiseavstanden from "@/app/sommerjobb/_components/UtvidReiseavstanden";
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
        <VStack as="section" gap="8" aria-labelledby={resultsId}>
            <HStack justify="center">
                <Heading id={resultsId} level="2" size="large" aria-live="polite">
                    {totalAds > 0
                        ? `Vi fant ${formatNumber(totalAds)} sommerjobber!`
                        : "Vi fant ingen sommerjobber som matcher valgene dine"}
                </Heading>
            </HStack>
            {totalAds > 0 ? (
                <>
                    <HGrid gap="4" columns={{ xs: 1, md: 2 }}>
                        {result.map((item) => (
                            <SommerjobbItem key={item.uuid} sommerjobbAd={item} />
                        ))}
                    </HGrid>
                    <SommerjobbPaginering totalAds={totalAds} />
                </>
            ) : (
                <UtvidReiseavstanden />
            )}
        </VStack>
    );
}

export default SommerjobbResults;
