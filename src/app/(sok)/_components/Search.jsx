"use client";

import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, Heading, HGrid, Hide, HStack, Show, Stack, VStack } from "@navikt/ds-react";
import SearchResult from "./searchResult/SearchResult";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import logAmplitudeEvent from "../../_common/monitoring/amplitude";
import LoggedInButtons from "./loggedInButtons/LoggedInButtons";
import FiltersMobile from "./filters/FiltersMobile";
import SearchBox from "./searchBox/SearchBox";

export default function Search({ searchResult, aggregations, locations }) {
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);

    useEffect(() => {
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    function onFormSubmit(e) {
        e.preventDefault();
    }

    return (
        <form onSubmit={onFormSubmit} className="mb-24">
            <Box paddingBlock={{ xs: "4", md: "10" }} paddingInline={{ xs: "4", sm: "6" }}>
                <Stack justify={{ md: "center" }}>
                    <Heading level="1" size="xlarge">
                        Søk etter din neste jobb
                    </Heading>
                </Stack>
            </Box>

            <div className="container-small">
                <SearchBox />
                <Box paddingBlock={{ xs: "0 4", md: "0 12" }}>
                    <HStack gap="2" justify={{ xs: "start", md: "center" }} align={{ xs: "start", md: "center" }}>
                        <Show below="lg">
                            <Button
                                variant="tertiary"
                                onClick={() => {
                                    setIsFiltersVisible(!isFiltersVisible);
                                }}
                                icon={<FilterIcon />}
                                aria-expanded={isFiltersVisible}
                            >
                                Velg sted, yrke og andre filtre
                            </Button>
                        </Show>

                        <LoggedInButtons />
                    </HStack>
                </Box>
            </div>

            <SearchResultHeader searchResult={searchResult} />

            <HGrid
                columns={{ xs: 1, lg: "220px auto", xl: "370px auto" }}
                gap={{ xs: "0", lg: "6", xl: "12" }}
                className="container-large mt-8"
            >
                <Hide below="lg">
                    <FiltersDesktop aggregations={aggregations} locations={locations} searchResult={searchResult} />
                </Hide>

                <Show below="lg">
                    {isFiltersVisible && (
                        <FiltersMobile
                            aggregations={aggregations}
                            locations={locations}
                            onCloseClick={() => setIsFiltersVisible(false)}
                            searchResult={searchResult}
                        />
                    )}
                </Show>

                <VStack gap="10">
                    <SelectedFilters />
                    <SearchResult searchResult={searchResult} />
                    <Feedback />
                </VStack>
            </HGrid>
        </form>
    );
}

Search.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.arrayOf(PropTypes.shape({})),
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    query: PropTypes.shape({}),
};
