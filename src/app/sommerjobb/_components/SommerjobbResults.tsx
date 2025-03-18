import React, { useRef } from "react";
import { Heading, HGrid, Stack, VStack } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";
import SommerjobbPagination from "@/app/sommerjobb/_components/SommerjobbPagination";
import ExtendDistanceButton from "@/app/sommerjobb/_components/ExtendDistanceButton";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import { useSearchParams } from "next/navigation";
import { POSTCODE_PARAM_NAME } from "@/app/sommerjobb/_components/constants";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import { SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";

interface SommerjobbResultsProps {
    result: SommerjobbAd[];
    totalAds: number;
}

function SommerjobbResults({ result, totalAds }: SommerjobbResultsProps): JSX.Element {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const searchParams = useSearchParams();

    const scrollToTopOfSearchResults = () => {
        headingRef?.current?.focus();
    };

    return (
        <Stack
            className="container-large"
            justify={{ md: "center" }}
            direction="column"
            as="section"
            gap={{ xs: "6", md: "8" }}
        >
            <Stack justify={{ md: "center" }}>
                <Heading tabIndex={-1} ref={headingRef} level="2" size="large" aria-live="polite">
                    {totalAds > 0
                        ? `Vi fant ${formatNumber(totalAds)} sommerjobber!`
                        : "Vi fant ingen sommerjobber som matcher valgene dine"}
                </Heading>
            </Stack>
            {totalAds > 0 && (
                <>
                    <HGrid gap="4" columns={{ xs: 1, md: 2 }}>
                        {result.map((item) => (
                            <SommerjobbItem sommerjobbAd={item} key={item.uuid} />
                        ))}
                    </HGrid>
                    {totalAds > SOMMERJOBB_SEARCH_RESULT_SIZE && (
                        <VStack align="center" width="100%">
                            <SommerjobbPagination
                                scrollToTopOfSearchResults={scrollToTopOfSearchResults}
                                totalAds={totalAds}
                            />
                        </VStack>
                    )}
                </>
            )}

            {totalAds === 0 && searchParams.has(POSTCODE_PARAM_NAME) && <ExtendDistanceButton />}
        </Stack>
    );
}

export default SommerjobbResults;
