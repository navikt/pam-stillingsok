import React, { useRef } from "react";
import { BodyShort, Box, Heading, HStack, HGrid, Link as AkselLink, Stack, VStack } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";
import SommerjobbPagination from "@/app/sommerjobb/_components/SommerjobbPagination";
import { useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import FigureConfused from "@/app/_common/components/FigureConfused";
import { ChevronRightIcon } from "@navikt/aksel-icons";
import { umamiTracking } from "@/app/_common/umami/umamiTracking";
import { SOMMERJOBB_KLIKK_KARRIEREVEILEDNING } from "@/app/_common/umami/constants";
import { PageBlock } from "@navikt/ds-react/Page";
import { SommerjobbResultData } from "@/app/sommerjobb/_utils/types/SommerjobbResultData";
import { formatSearchSummary } from "@/app/sommerjobb/_utils/formatSearchSummary";

interface SommerjobbResultsProps extends Pick<SommerjobbResultData, "ads" | "totalAds" | "totalStillinger"> {}

function SommerjobbResults({ ads, totalAds, totalStillinger }: SommerjobbResultsProps) {
    const headingRef = useRef<HTMLHeadingElement>(null);
    const searchParams = useSearchParams();

    const scrollToTopOfSearchResults = () => {
        headingRef?.current?.focus();
    };

    const page = searchParams.get(PAGE_PARAM_NAME) || "1";

    return (
        <PageBlock as="section" width="2xl" gutters>
            <Stack justify={{ md: "center" }} direction="column" as="section" gap={{ xs: "space-24", md: "space-32" }}>
                <Stack justify={{ md: "center" }}>
                    <Heading tabIndex={-1} ref={headingRef} level="2" size="large" aria-live="polite">
                        {totalAds > 0
                            ? formatSearchSummary(totalStillinger, totalAds)
                            : "Vi fant ingen sommerjobber som matcher valgene dine"}
                    </Heading>
                </Stack>
                {totalAds > 0 && (
                    <>
                        <HGrid gap="space-16" columns={{ xs: 1, md: 2 }}>
                            {ads.map((item, index) => (
                                <React.Fragment key={item.uuid}>
                                    {index === 6 && page === "2" && (
                                        <Box
                                            key={`karriereveiledning-${index}`}
                                            as="article"
                                            background="default"
                                            borderRadius="2"
                                            data-nosnippet="true"
                                        >
                                            <HStack
                                                justify="space-between"
                                                wrap={false}
                                                gap="space-20"
                                                as={AkselLink}
                                                className="custom-link-panel"
                                                rel="external"
                                                href={`https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb`}
                                                onClick={() => {
                                                    umamiTracking(SOMMERJOBB_KLIKK_KARRIEREVEILEDNING);
                                                }}
                                            >
                                                <div className="min-width">
                                                    <Heading level="3" size="small" spacing>
                                                        Trenger du hjelp til å finne en jobb?
                                                    </Heading>

                                                    <BodyShort spacing>
                                                        På Karriereveiledning.no finner du tips og verktøy til
                                                        jobbsøking. Du kan også få gratis veiledning på chat, telefon og
                                                        e-post.
                                                    </BodyShort>

                                                    <HStack justify="center">
                                                        <FigureConfused />
                                                    </HStack>
                                                </div>
                                                <VStack justify="center">
                                                    <ChevronRightIcon
                                                        className="chevron"
                                                        fontSize="1.5rem"
                                                        aria-hidden="true"
                                                    />
                                                </VStack>
                                            </HStack>
                                        </Box>
                                    )}

                                    <SommerjobbItem sommerjobbAd={item} />
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

export default SommerjobbResults;
