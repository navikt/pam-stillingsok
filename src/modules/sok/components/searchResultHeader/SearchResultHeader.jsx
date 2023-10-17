import React from "react";
import { BodyShort, Box, Heading, HGrid, HStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import SearchResultCount from "../searchResult/SearchResultCount";
import Sorting from "../searchResult/Sorting";

function SearchResultHeader({ searchResponse, query, queryDispatch }) {
    return (
        <Box background="surface-alt-1-subtle" paddingBlock="4">
            <HGrid columns={{ xs: 1, lg: "320px auto" }} gap={{ lg: "12" }} className="container-large">
                <div />
                <HStack justify="space-between" align="center" gap="4 8">
                    <div>
                        <Heading level="2" size="small" className="mb-1">
                            Søkeresultat
                        </Heading>
                        {searchResponse && searchResponse.data && searchResponse.data.totalAds >= 0 ? (
                            <SearchResultCount searchResult={searchResponse.data} />
                        ) : (
                            <BodyShort textColor="subtle">Laster...</BodyShort>
                        )}
                    </div>
                    <Sorting dispatch={queryDispatch} query={query} />
                </HStack>
            </HGrid>
        </Box>
    );
}

SearchResultHeader.propTypes = {
    searchResponse: PropTypes.shape({
        data: PropTypes.shape({
            totalAds: PropTypes.number,
        }),
    }),
    queryDispatch: PropTypes.func.isRequired,
    query: PropTypes.shape({}),
};

export default SearchResultHeader;
