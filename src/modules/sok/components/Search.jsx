import React, { useContext, useEffect, useReducer, useState } from "react";
import { Button, HGrid, Hide, Show, Stack } from "@navikt/ds-react";
import { useHistory } from "react-router";
import { CONTEXT_PATH } from "../../common/environment";
import queryReducer, { isSearchQueryEmpty, SET_FROM, stringifyQuery, toBrowserQuery } from "../query";
import { extractParam } from "../../common/utils/utils";
import { FetchStatus } from "../../common/hooks/useFetchReducer";
import ErrorMessage from "../../common/components/messages/ErrorMessage";
import SearchBoxForm from "./searchBox/SearchBoxForm";
import SearchResult from "./searchResult/SearchResult";
import H1WithAutoFocus from "../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import DelayedSpinner from "../../common/components/spinner/DelayedSpinner";
import FiltersDesktop from "./filters/FiltersDesktop";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "./icons/FilterIcon";
import { AuthenticationContext, AuthenticationStatus } from "../../common/auth/contexts/AuthenticationProvider";
import LoadingScreen from "../../common/components/loadingScreen/LoadingScreen";
import logAmplitudeEvent from "../../common/tracking/amplitude";
import LoggedInButtons from "./loggedInButtons/LoggedInButtons";
import FiltersMobile from "./filters/FiltersMobile";
import HotjarSurvey from "./feedback/HotjarSurvey";

export default function Search({ initialSearchResponse, searchResponse, initialQuery, fetchSearch }) {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery);
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    const [initialRenderDone, setInitialRenderDone] = useState(false);

    const router = useHistory();

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

            logAmplitudeEvent("Stillinger - Utførte søk", { query });

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
            <H1WithAutoFocus className="container-medium mt-12 mb-12 text-center" spacing={false}>
                Søk etter din neste jobb
            </H1WithAutoFocus>

            <div className="container-small">
                <SearchBoxForm
                    query={query}
                    dispatchQuery={queryDispatch}
                    fetchSearch={() => {
                        fetchSearch();
                    }}
                />
                <Stack
                    gap="2"
                    direction={{ xs: "column", md: "row" }}
                    justify={{ xs: "start", md: "center" }}
                    align={{ xs: "start", md: "center" }}
                    className="mb-12"
                >
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

                    {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED ? (
                        <LoggedInButtons />
                    ) : (
                        <Hide below="md">
                            <LoggedInButtons />
                        </Hide>
                    )}
                </Stack>
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
                    columns={{ xs: 1, md: "280px auto", lg: "320px auto" }}
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

                    <div>
                        <HotjarSurvey />
                        <SelectedFilters query={query} queryDispatch={queryDispatch} />
                        {searchResponse.status === FetchStatus.IS_FETCHING && query.from === 0 ? (
                            <DelayedSpinner />
                        ) : (
                            <>
                                <SearchResult
                                    initialSearchResponse={initialSearchResponse}
                                    searchResponse={searchResponse}
                                    query={query}
                                    queryDispatch={queryDispatch}
                                    loadMoreResults={() => {
                                        loadMoreResults();
                                    }}
                                />
                                <DoYouWantToSaveSearch query={query} />
                                <Feedback query={query} />
                            </>
                        )}
                    </div>
                </HGrid>
            )}
        </>
    );
}
