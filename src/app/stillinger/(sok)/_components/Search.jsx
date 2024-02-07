import React, { useEffect, useReducer, useState } from "react";
import PropTypes from "prop-types";
import { Box, Button, HGrid, Hide, HStack, Show, Stack } from "@navikt/ds-react";
import useRouter from "../../../../migrating/useRouter";
import { CONTEXT_PATH } from "../../_common/environment";
import queryReducer, { isSearchQueryEmpty, SET_FROM, stringifyQuery, toBrowserQuery } from "./old_query";
import { extractParam } from "../../_common/utils/utils";
import { FetchStatus } from "../../_common/hooks/useFetchReducer";
import ErrorMessage from "../../_common/components/messages/ErrorMessage";
import SearchBoxForm from "./searchBox/SearchBoxForm";
import SearchResult from "./searchResult/SearchResult";
import H1WithAutoFocus from "../../_common/components/h1WithAutoFocus/H1WithAutoFocus";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import LoadingScreen from "../../_common/components/loadingScreen/LoadingScreen";
import logAmplitudeEvent from "../../_common/tracking/amplitude";
import LoggedInButtons from "./loggedInButtons/LoggedInButtons";
import FiltersMobile from "./filters/FiltersMobile";

export default function Search({ initialSearchResponse, searchResponse, initialQuery, fetchSearch, isDebug }) {
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

            if (fetchSearch) {
                fetchSearch(query);
            }

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
                searchResponse={searchResponse}
                query={query}
                queryDispatch={queryDispatch}
            />

            {(initialSearchResponse.status === FetchStatus.NOT_FETCHED ||
                initialSearchResponse.status === FetchStatus.IS_FETCHING) && <LoadingScreen />}
            {initialSearchResponse.status === FetchStatus.FAILURE && <ErrorMessage />}
            {initialSearchResponse.status === FetchStatus.SUCCESS && (
                <HGrid
                    columns={{ xs: 1, md: "280px auto", lg: "370px auto" }}
                    gap={{ xs: "0", md: "12" }}
                    className="container-large mt-8 mb-16"
                >
                    <Hide below="md">
                        <FiltersDesktop
                            query={query}
                            dispatchQuery={queryDispatch}
                            initialSearchResult={initialSearchResponse.data}
                            searchResult={searchResponse.data}
                        />
                    </Hide>

                    <Show below="md">
                        {isFiltersVisible && (
                            <FiltersMobile
                                query={query}
                                dispatchQuery={queryDispatch}
                                initialSearchResult={initialSearchResponse.data}
                                onCloseClick={() => setIsFiltersVisible(false)}
                                searchResult={searchResponse.data}
                            />
                        )}
                    </Show>

                    <div>
                        <SelectedFilters query={query} queryDispatch={queryDispatch} />
                        <SearchResult
                            initialSearchResponse={initialSearchResponse}
                            searchResponse={searchResponse}
                            query={query}
                            queryDispatch={queryDispatch}
                            loadMoreResults={() => {
                                loadMoreResults();
                            }}
                            isDebug={isDebug}
                        />
                        <DoYouWantToSaveSearch query={query} />
                        <Feedback query={query} />
                    </div>
                </HGrid>
            )}
        </>
    );
}

Search.propTypes = {
    initialSearchResponse: PropTypes.shape({
        data: PropTypes.shape({}),
        status: PropTypes.string,
    }),
    searchResponse: PropTypes.shape({
        data: PropTypes.shape({}),
        status: PropTypes.string,
    }),
    initialQuery: PropTypes.shape({}),
    fetchSearch: PropTypes.func,
    isDebug: PropTypes.bool,
};
