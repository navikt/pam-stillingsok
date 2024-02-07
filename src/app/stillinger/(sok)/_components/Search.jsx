"use client";

import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, HGrid, Hide, HStack, Show, Stack } from "@navikt/ds-react";
import { useRouter } from "next/navigation";
import { CONTEXT_PATH } from "../../../_common/environment";
import queryReducer, { isSearchQueryEmpty, SET_FROM, stringifyQuery, toBrowserQuery } from "./old_query";
import { extractParam } from "../../../_common/utils/utils";
import SearchBoxForm from "./searchBox/SearchBoxForm";
import SearchResult from "./searchResult/SearchResult";
import H1WithAutoFocus from "../../../_common/components/h1WithAutoFocus/H1WithAutoFocus";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import logAmplitudeEvent from "../../../_common/tracking/amplitude";
import LoggedInButtons from "./loggedInButtons/LoggedInButtons";
import FiltersMobile from "./filters/FiltersMobile";

export default function Search({ searchResult, aggregations, locations, initialQuery, isDebug }) {
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [initialRenderDone, setInitialRenderDone] = useState(false);

    const router = useRouter();

    /**
     * Perform a search when user changes search criteria
     */
    useEffect(() => {
        if (initialRenderDone) {
            const browserQuery = toBrowserQuery(query);

            // Keep saved search uuid in browser url, as long as there are some search criteria.
            // This uuid is used when user update an existing saved search
            const savedSearchUuid = extractParam("saved");
            if (!isSearchQueryEmpty(browserQuery) && savedSearchUuid) {
                browserQuery.saved = savedSearchUuid;
            }

            logAmplitudeEvent("Stillinger - Utførte søk");

            try {
                router.replace(CONTEXT_PATH + stringifyQuery(browserQuery), { scroll: false });
            } catch (error) {
                // ignore any errors
            }
        } else {
            // Skip search first time query change, since that
            // will just reload the search result we already got
            setInitialRenderDone(true);
        }
    }, [query]);

    function loadMoreResults() {
        queryDispatch({ type: SET_FROM, value: query.from + query.size });
    }

    return (
        <>
            <Box paddingBlock={{ xs: "4", md: "12" }} paddingInline={{ xs: "4", sm: "6" }}>
                <Stack justify={{ md: "center" }}>
                    <H1WithAutoFocus spacing={false}>Søk etter din neste jobb</H1WithAutoFocus>
                </Stack>
            </Box>

            <div className="container-small">
                <SearchBoxForm query={query} dispatchQuery={queryDispatch} />
                <Box paddingBlock={{ xs: "0 4", md: "0 12" }}>
                    <HStack gap="2" justify={{ xs: "start", md: "center" }} align={{ xs: "start", md: "center" }}>
                        <Show below="md">
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

            <SearchResultHeader
                isFiltersVisible={isFiltersVisible}
                searchResult={searchResult}
                query={initialQuery}
                queryDispatch={queryDispatch}
            />

            <HGrid
                columns={{ xs: 1, md: "280px auto", lg: "370px auto" }}
                gap={{ xs: "0", md: "12" }}
                className="container-large mt-8 mb-16"
            >
                <Hide below="md">
                    <FiltersDesktop
                        query={initialQuery}
                        dispatchQuery={queryDispatch}
                        aggregations={aggregations}
                        locations={locations}
                        searchResult={searchResult}
                    />
                </Hide>

                <Show below="md">
                    {isFiltersVisible && (
                        <FiltersMobile
                            query={initialQuery}
                            dispatchQuery={queryDispatch}
                            aggregations={aggregations}
                            locations={locations}
                            onCloseClick={() => setIsFiltersVisible(false)}
                            searchResult={searchResult}
                        />
                    )}
                </Show>

                <div>
                    <SelectedFilters query={initialQuery} queryDispatch={queryDispatch} />
                    <SearchResult
                        searchResult={searchResult}
                        query={initialQuery}
                        queryDispatch={queryDispatch}
                        loadMoreResults={() => {
                            loadMoreResults();
                        }}
                        isDebug={isDebug}
                    />
                    <DoYouWantToSaveSearch query={initialQuery} />
                    <Feedback query={initialQuery} />
                </div>
            </HGrid>
        </>
    );
}

Search.propTypes = {
    aggregations: PropTypes.shape({}),
    locations: PropTypes.shape({}),
    searchResult: PropTypes.shape({
        ads: PropTypes.shape({}),
    }),
    initialQuery: PropTypes.shape({}),
    isDebug: PropTypes.bool,
};
