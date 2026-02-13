import React from "react";
import { BodyShort, Box, Button, Heading, HGrid, HStack, Show, Stack } from "@navikt/ds-react";
import Sorting from "@/app/stillinger/(sok)/_components/searchResult/Sorting";
import { formatNumber } from "@/app/stillinger/_common/utils/utils";
import FilterIcon from "@/app/_common/components/FilterIcon";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { PageBlock } from "@navikt/ds-react/Page";

interface SearchResultHeaderProps {
    searchResult: SearchResult;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (isFiltersVisible: boolean) => void;
}

export default function SearchResultHeader({
    searchResult,
    isFiltersVisible,
    setIsFiltersVisible,
}: SearchResultHeaderProps) {
    const stillingerWord: string = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

    return (
        <Box className="bg-alt-1-subtle-on-lg" paddingBlock={{ lg: "space-16" }}>
            <PageBlock as="section" width="xl" gutters>
                <HGrid
                    columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                    gap={{ xs: "space-0", lg: "space-24", xl: "space-48" }}
                >
                    <div />
                    <Stack
                        direction={{ xs: "column", md: "row" }}
                        justify={{ md: "space-between" }}
                        align={{ sm: "start", md: "center" }}
                        gap="space-16 space-32"
                        wrap={false}
                    >
                        <HStack
                            gap="space-8"
                            wrap={false}
                            justify="space-between"
                            align="center"
                            className="full-width"
                        >
                            <div>
                                <Heading level="2" size="small" className="white-space-nowrap" aria-live="polite">
                                    <span>
                                        {searchResult.totalAds > 0
                                            ? `${formatNumber(searchResult.totalAds)} treff`
                                            : "Ingen treff"}
                                    </span>
                                </Heading>
                                <BodyShort className="white-space-nowrap">
                                    {searchResult.totalPositions && searchResult.totalAds > 0
                                        ? `${formatNumber(searchResult.totalPositions)} ${stillingerWord}`
                                        : ""}
                                </BodyShort>
                            </div>

                            <HStack gap="space-8" align="center" wrap={false}>
                                <Sorting />

                                <Show below="lg">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        onClick={() => {
                                            setIsFiltersVisible(!isFiltersVisible);
                                        }}
                                        icon={<FilterIcon />}
                                        aria-expanded={isFiltersVisible}
                                        aria-label="Velg sted, yrke og andre filtre"
                                    />
                                </Show>
                            </HStack>
                        </HStack>
                    </Stack>
                </HGrid>
            </PageBlock>
        </Box>
    );
}
