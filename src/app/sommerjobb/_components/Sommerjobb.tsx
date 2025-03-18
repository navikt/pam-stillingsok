"use client";

import React from "react";
import { Alert, BodyShort, Box, Heading, Hide, HStack, ReadMore, Stack } from "@navikt/ds-react";
import SommerjobbResults from "@/app/sommerjobb/_components/SommerjobbResults";
import GreenFlower from "@/app/sommerjobb/_components/icons/GreenFlower";
import RedFlower from "@/app/sommerjobb/_components/icons/RedFlower";
import { Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import SommerjobbWorkCategory from "@/app/sommerjobb/_components/SommerjobbWorkCategory";
import SommerjobbDistance from "@/app/sommerjobb/_components/SommerjobbDistance";
import mapFromUrlParamToJobCategories from "@/app/sommerjobb/_utils/mapFromUrlParamToJobCategories";
import { useSearchParams } from "next/navigation";
import { JOB_CATEGORY_PARAM_NAME, SOMMERJOBB_KEYWORDS, SOMMERJOBB_PHRASES } from "@/app/sommerjobb/_utils/constants";
import { SommerjobbResultData } from "@/app/sommerjobb/_utils/types/SommerjobbResultData";

interface SommerjobbProps {
    data: SommerjobbResultData;
    postcodes: Postcode[];
}

function Sommerjobb({ data, postcodes }: SommerjobbProps): JSX.Element {
    const searchParams = useSearchParams();

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

                <ReadMore header="Hva søkes det på?">
                    <BodyShort size="small" textColor="subtle" spacing>
                        Denne informasjonen er her bare mens sommerjobb-siden testes.
                    </BodyShort>
                    <Heading size="xsmall" spacing>
                        Sommerjobber finnes med disse søkerordene:
                    </Heading>
                    <HStack gap="2" className="mb-4">
                        {[...SOMMERJOBB_PHRASES, ...SOMMERJOBB_KEYWORDS].map((it) => (
                            <Box key={it} background="surface-info-subtle" paddingBlock="1" paddingInline="2">
                                <BodyShort className="monospace" size="small">
                                    {it}
                                </BodyShort>
                            </Box>
                        ))}
                    </HStack>
                    <Heading size="xsmall" spacing>
                        Pluss en eller flere av disse:
                    </Heading>
                    <HStack gap="2">
                        {mapFromUrlParamToJobCategories(searchParams.getAll(JOB_CATEGORY_PARAM_NAME)).length > 0 ? (
                            <>
                                {" "}
                                {mapFromUrlParamToJobCategories(searchParams.getAll(JOB_CATEGORY_PARAM_NAME)).map(
                                    (it) => (
                                        <Box
                                            key={it}
                                            background="surface-info-subtle"
                                            paddingBlock="1"
                                            paddingInline="2"
                                        >
                                            <BodyShort className="monospace" size="small">
                                                {it}
                                            </BodyShort>
                                        </Box>
                                    ),
                                )}
                            </>
                        ) : (
                            <BodyShort size="small" textColor="subtle">
                                * Flere søkeord dukker opp her hvis du krysser av på kategoriene over
                            </BodyShort>
                        )}
                    </HStack>
                </ReadMore>
            </Box>
            <Box background="surface-alt-3-subtle" paddingBlock={{ xs: "6", md: "8" }}>
                <SommerjobbResults result={data.ads} totalAds={data.totalAds} />
            </Box>
        </Box>
    );
}

export default Sommerjobb;
