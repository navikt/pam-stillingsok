import React, { useRef } from "react";
import { BodyShort, Box, Heading, HStack, HGrid, Link as AkselLink, Stack, VStack } from "@navikt/ds-react";
import SommerjobbItem from "@/app/sommerjobb/_components/SommerjobbItem";
import SommerjobbPagination from "@/app/sommerjobb/_components/SommerjobbPagination";
import ExtendDistanceButton from "@/app/sommerjobb/_components/ExtendDistanceButton";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import { useSearchParams } from "next/navigation";
import { PAGE_PARAM_NAME, POSTCODE_PARAM_NAME } from "@/app/sommerjobb/_utils/constants";
import { SommerjobbAd } from "@/app/sommerjobb/_utils/types/SommerjobbAd";
import FigureConfused from "@/app/_common/components/FigureConfused";
import { ChevronRightIcon } from "@navikt/aksel-icons";

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

    const page = searchParams.get(PAGE_PARAM_NAME) || "1";

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
                        {result.map((item, index) => (
                            <>
                                {index === 6 && page === "2" && (
                                    <Box as="article" shadow="small" background="surface-default" borderRadius="small">
                                        <HStack
                                            justify="space-between"
                                            wrap={false}
                                            gap="5"
                                            as={AkselLink}
                                            className="custom-link-panel"
                                            href={`https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb`}
                                            data-umami-event="Sommerjobb klikk karriereveiledning"
                                        >
                                            <div className="min-width">
                                                <Heading level="3" size="small" spacing>
                                                    Trenger du hjelp til å finne en jobb?
                                                </Heading>

                                                <BodyShort spacing>
                                                    På Karriereveiledning.no finner du tips og verktøy til jobbsøking.
                                                    Du kan også få gratis veiledning på chat, telefon og e-post.
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

                                <SommerjobbItem sommerjobbAd={item} key={item.uuid} />
                            </>
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

            {totalAds === 0 && searchParams.has(POSTCODE_PARAM_NAME) && <ExtendDistanceButton />}
        </Stack>
    );
}

export default SommerjobbResults;
