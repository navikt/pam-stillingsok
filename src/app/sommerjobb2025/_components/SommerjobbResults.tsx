"use client";

import React, { useEffect, useId, useRef } from "react";
import { Heading, HGrid, Stack, VStack } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";
import SommerjobbPagination from "@/app/sommerjobb/_components/SommerjobbPagination";
import ExtendDistanceButton from "@/app/sommerjobb/_components/ExtendDistanceButton";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import { useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";

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
    const firstItemRef = useRef<HTMLDivElement>();
    const searchParams = useSearchParams();

    // Elastic search does not allow pagination above 10 000 results.
    const numberOfPages = Math.ceil(totalAds < 10000 ? totalAds / SEARCH_RESULT_SIZE : 9999 / SEARCH_RESULT_SIZE);
    const currentPage = searchParams.has(PAGE_PARAM_NAME) ? parseInt(searchParams.get(PAGE_PARAM_NAME)!) : 1;

    useEffect(() => {
        if (searchParams.has(PAGE_PARAM_NAME)) {
            firstItemRef?.current?.focus();
        }
    }, [searchParams]);

    return (
        <Stack
            justify={{ md: "center" }}
            direction="column"
            as="section"
            gap={{ xs: "6", md: "8" }}
            aria-labelledby={resultsId}
        >
            <Stack justify={{ md: "center" }}>
                <Heading id={resultsId} level="2" size="large" aria-live="polite">
                    {totalAds > 0
                        ? `Vi fant ${formatNumber(totalAds)} sommerjobber!`
                        : "Vi fant ingen sommerjobber som matcher valgene dine"}
                </Heading>
            </Stack>
            {totalAds > 0 ? (
                <>
                    <HGrid gap="4" columns={{ xs: 1, md: 2 }} aria-label={`Side ${currentPage} av ${numberOfPages}`}>
                        {result.map((item, index) => (
                            <SommerjobbItem
                                key={item.uuid}
                                sommerjobbAd={item}
                                ref={index === 0 ? firstItemRef : undefined}
                            />
                        ))}
                    </HGrid>
                    <VStack align="center" width="100%">
                        <SommerjobbPagination numberOfPages={numberOfPages} currentPage={currentPage} />
                    </VStack>
                </>
            ) : (
                <ExtendDistanceButton />
            )}
        </Stack>
    );
}

export default SommerjobbResults;
