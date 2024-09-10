import React from "react";
import { BodyShort, Box, Button, Heading, HGrid, HStack, Show, Stack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Sorting from "@/app/(sok)/_components/searchResult/Sorting";
import { formatNumber } from "@/app/_common/utils/utils";
import FilterIcon from "@/app/(sok)/_components/icons/FilterIcon";

function SearchResultHeader({ searchResult, isFiltersVisible, setIsFiltersVisible }) {
    const stillingerWord = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

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
                    align={{ sm: "flex-start", md: "center" }}
                    gap="4 8"
                    wrap={false}
                >
                    <HStack gap="2" wrap={false} justify="space-between" align="center" className="full-width">
                        <div>
                            <Heading level="2" size="small" role="status" className="white-space-nowrap">
                                {searchResult.totalAds > 0
                                    ? `${formatNumber(searchResult.totalAds)} treff`
                                    : "Ingen treff"}
                            </Heading>
                            <BodyShort className="white-space-nowrap">
                                {searchResult.totalAds > 0
                                    ? `${formatNumber(searchResult.totalPositions)} ${stillingerWord}`
                                    : ""}
                            </BodyShort>
                        </div>
                        <HStack gap="2" align="center" wrap={false}>
                            <Sorting />

                            <Show below="lg">
                                <Button
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

SearchResultHeader.propTypes = {
    searchResult: PropTypes.shape({
        totalAds: PropTypes.number,
        totalPositions: PropTypes.number,
    }),
};

export default SearchResultHeader;
