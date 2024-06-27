import React from "react";
import { BodyShort, Box, Heading, HGrid, Stack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import Sorting from "@/app/(sok)/_components/searchResult/Sorting";
import { formatNumber } from "@/app/_common/utils/utils";

function SearchResultHeader({ searchResult, query, queryDispatch }) {
    const annonserWord = searchResult.totalAds === 1 ? "annonse" : "annonser";
    const stillingerWord = searchResult.totalPositions === 1 ? "stilling" : "stillinger";

    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4">
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
                    <div>
                        <Heading level="2" size="small" className="mb-1">
                            Søkeresultat
                        </Heading>
                        <BodyShort role="status">
                            {searchResult.totalAds === 0
                                ? "Ingen treff"
                                : `${formatNumber(searchResult.totalPositions)} ${stillingerWord} i ${formatNumber(
                                      searchResult.totalAds,
                                  )} ${annonserWord}`}
                        </BodyShort>
                    </div>
                    <Sorting dispatch={queryDispatch} query={query} />
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
    queryDispatch: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
};

export default SearchResultHeader;
