import React, { useRef } from "react";
import { Heading, HGrid, Stack, VStack } from "@navikt/ds-react";
import SommerjobbPagination from "@/app/sommerjobb/_components/SommerjobbPagination";
import { PageBlock } from "@navikt/ds-react/Page";
import { MuligheterResultData } from "@/app/muligheter/(sok)/_utils/types/MuligheterResultData";
import { formatCountWithNoun, NounForms } from "@/app/_common/i18n/nbPlural";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import MulighetItem from "@/app/muligheter/(sok)/_components/MulighetItem";

interface MuligheterResultsProps extends Pick<MuligheterResultData, "ads" | "totalAds"> {}

const muligheterNounForms: NounForms = { singular: "jobbmulighet", plural: "jobbmuligheter" };

function MuligheterResults({ ads, totalAds }: MuligheterResultsProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);

    const scrollToTopOfSearchResults = () => {
        headingRef?.current?.focus();
    };

    const headingText =
        totalAds > 0
            ? `Vi fant ${formatCountWithNoun(totalAds, muligheterNounForms, formatNumber)}!`
            : "Vi fant ingen sommerjobber som matcher valgene dine";

    return (
        <PageBlock as="section" width="2xl" gutters>
            <Stack justify={{ md: "center" }} direction="column" as="section" gap={{ xs: "space-24", md: "space-32" }}>
                <Stack justify={{ md: "center" }}>
                    <Heading tabIndex={-1} ref={headingRef} level="2" size="large" aria-live="polite">
                        {headingText}
                    </Heading>
                </Stack>
                {totalAds > 0 && (
                    <>
                        <HGrid gap="space-16" columns={{ xs: 1, md: 2 }}>
                            {ads.map((item) => (
                                <React.Fragment key={item.uuid}>
                                    <MulighetItem mulighet={item} />
                                </React.Fragment>
                            ))}
                        </HGrid>
                        <VStack align="center" width="100%">
                            <SommerjobbPagination
                                scrollToTopOfSearchResults={scrollToTopOfSearchResults}
                                totalAds={totalAds}
                            />
                        </VStack>
                    </>
                )}
            </Stack>
        </PageBlock>
    );
}

export default MuligheterResults;
