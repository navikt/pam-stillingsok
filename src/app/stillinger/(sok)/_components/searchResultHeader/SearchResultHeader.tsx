import React, { ReactElement } from "react";
import { Box, Button, HGrid, HStack, Show, Stack } from "@navikt/ds-react";
import Sorting from "@/app/stillinger/(sok)/_components/searchResult/Sorting";
import FilterIcon from "@/app/_common/components/FilterIcon";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import NumberOfHits from "@/app/stillinger/(sok)/_components/searchResultHeader/NumberOfHits";

interface SearchResultHeaderProps {
    searchResult: SearchResult;
    isFiltersVisible: boolean;
    setIsFiltersVisible: (isFiltersVisible: boolean) => void;
}

export default function SearchResultHeader({
    searchResult,
    isFiltersVisible,
    setIsFiltersVisible,
}: SearchResultHeaderProps): ReactElement {
    return (
        <Box className="bg-alt-1-subtle-on-lg" paddingBlock={{ lg: "4" }}>
            <HGrid
                columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                gap={{ xs: "0", lg: "6", xl: "12" }}
                className="container-large"
            >
                <div />
                <Stack
                    direction={{ xs: "column", md: "row" }}
                    justify={{ md: "space-between" }}
                    align={{ sm: "start", md: "center" }}
                    gap="4 8"
                    wrap={false}
                >
                    <HStack gap="2" wrap={false} justify="space-between" align="center" className="full-width">
                        <NumberOfHits totalAds={searchResult.totalAds} totalPositions={searchResult.totalPositions} />
                        <HStack gap="2" align="center" wrap={false}>
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
        </Box>
    );
}
