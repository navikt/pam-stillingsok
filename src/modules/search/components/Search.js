import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { CONTEXT_PATH } from "../../../common/environment";
import queryReducer, {
    initialQuery,
    initQueryWithValuesFromBrowserUrl,
    isSearchQueryEmpty,
    SET_FROM,
    stringifyQuery,
    toApiQuery,
    toBrowserQuery
} from "../query";
import { extractParam } from "../../../common/components/utils";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import SearchAPI from "../../../common/api/SearchAPI";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import SearchForm from "./searchForm/SearchForm";
import useRestoreScroll from "../../../common/hooks/useRestoreScroll";
import "./Search.css";
import { useHistory } from "react-router";
import SearchResult from "./searchResult/SearchResult";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import { Button } from "@navikt/ds-react";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";
import useDevice, { Device } from "../../../common/hooks/useDevice";
import FilterForm from "./searchForm/filters/FilterForm";
import SearchResultHeader from "./searchResultHeader/SearchResultHeader";
import FilterIcon from "../../../common/components/icons/FilterIcon";
import { ClockIcon, HeartIcon } from "@navikt/aksel-icons";
import { AuthenticationContext, AuthenticationStatus } from "../../auth/contexts/AuthenticationProvider";
import { Link } from "react-router-dom";
import LoadingScreen from "./loadingScreen/LoadingScreen";

const Search = () => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery, initQueryWithValuesFromBrowserUrl);
    const [initialSearchResponse, initialSearchDispatch] = useFetchReducer();
    const [searchResponse, searchDispatch] = useFetchReducer();
    const latestSearch = useRef();
    const numberOfSelectedFilters = Object.keys(toBrowserQuery(query)).length;
    const { device } = useDevice();
    const [isFiltersVisible, setIsFiltersVisible] = useState(false);
    let history = useHistory();
    const { resetScroll } = useRestoreScroll("search-page", initialSearchResponse.status === FetchStatus.SUCCESS);

    useEffect(() => {
        if (numberOfSelectedFilters === 0) {
            resetScroll();
        }
    }, []);

    /**
     * Make an initial search when view is shown.
     * Search again when user changes a search criteria.
     */
    useEffect(() => {
        if (initialSearchResponse.status === FetchStatus.NOT_FETCHED) {
            fetchInitialSearch();
        } else {
            fetchSearch();
        }
    }, [query]);

    /**
     * Update the browser url when user changes search criteria
     */
    useEffect(() => {
        const browserQuery = toBrowserQuery(query);

        // Keep saved search uuid in browser url, as long as there are some search criteria.
        // This uuid is used when user update an existing saved search
        const savedSearchUuid = extractParam("saved");
        if (!isSearchQueryEmpty(browserQuery) && savedSearchUuid) {
            browserQuery.saved = savedSearchUuid;
        }

        try {
            history.replace(CONTEXT_PATH + stringifyQuery(browserQuery));
        } catch (error) {
            // ignore any errors
        }
    }, [query]);

    function fetchInitialSearch() {
        initialSearchDispatch({ type: FetchAction.BEGIN });

        const promises = [
            SearchAPI.search(toApiQuery(initialQuery)), // An empty search aggregates search criteria across all ads
            SearchAPI.getAndCache("api/locations") // Search criteria for locations are not aggregated, but based on a predefined list
        ];

        // If user has some search criteria in browser url, make an extra search to get that result
        if (Object.keys(toBrowserQuery(query)).length > 0) {
            promises.push(SearchAPI.search(toApiQuery(query)));
        }

        Promise.all(promises).then(
            (responses) => {
                const [initialSearchResult, locations, searchResult] = responses;
                searchDispatch({ type: FetchAction.RESOLVE, data: searchResult ? searchResult : initialSearchResult });
                initialSearchDispatch({ type: FetchAction.RESOLVE, data: { ...initialSearchResult, locations } });
            },
            (error) => {
                initialSearchDispatch({ type: FetchAction.REJECT, error });
            }
        );
    }

    function fetchSearch() {
        searchDispatch({ type: FetchAction.BEGIN });
        const search = SearchAPI.search(toApiQuery(query));

        // To avoid race conditions, when multiple search are done simultaneously,
        // we handle only the latest search response
        latestSearch.current = search;

        search
            .then((response) => {
                if (latestSearch.current === search) {
                    const mergedResult = query.from > 0 ? mergeAndRemoveDuplicates(searchResponse, response) : response;
                    searchDispatch({ type: FetchAction.RESOLVE, data: mergedResult });
                }
            })
            .catch((error) => {
                if (search === latestSearch.current) {
                    searchDispatch({ type: FetchAction.REJECT, error });
                }
            });
    }

    function loadMoreResults() {
        queryDispatch({ type: SET_FROM, value: query.from + query.size });
    }

    /**
     * Når man laster inn flere annonser, kan en allerede lastet annonse komme på nytt. Dette kan f.eks skje
     * ved at annonser legges til/slettes i backend, noe som fører til at pagineringen og det faktiske datasettet
     * blir usynkronisert. Funskjonen fjerner derfor duplikate annonser i søkeresultatet.
     */
    function mergeAndRemoveDuplicates(searchResponse, response) {
        return {
            ...response,
            ads: [
                ...searchResponse.data.ads,
                ...response.ads.filter((a) => {
                    const duplicate = searchResponse.data.ads.find((b) => a.uuid === b.uuid);
                    return !duplicate;
                })
            ]
        };
    }

    return (
        <div className={isFiltersVisible ? "filter-visible" : "filter-not-visible"}>
            <H1WithAutoFocus className="container-medium  Search__h1" spacing={false}>
                Søk etter din neste jobb
            </H1WithAutoFocus>
            {initialSearchResponse.status === FetchStatus.FAILURE && <ErrorMessage />}
            {initialSearchResponse.status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {initialSearchResponse.status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <div className="container-small">
                        <SearchForm
                            query={query}
                            dispatchQuery={queryDispatch}
                            initialSearchResult={initialSearchResponse.data}
                            searchResult={searchResponse.data}
                            fetchSearch={fetchSearch}
                        />
                        <div className="Search__buttons">
                            {device === Device.MOBILE && (
                                <Button
                                    variant="tertiary"
                                    onClick={() => {
                                        setIsFiltersVisible(!isFiltersVisible);
                                    }}
                                    icon={<FilterIcon />}
                                    aria-expanded={isFiltersVisible}
                                >
                                    Filtre
                                </Button>
                            )}
                            {(device === Device.DESKTOP ||
                                (device === Device.MOBILE &&
                                    authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED)) && (
                                <React.Fragment>
                                    <Button
                                        as={Link}
                                        to={`${CONTEXT_PATH}/lagrede-sok`}
                                        type="button"
                                        variant="tertiary"
                                        onClick={() => {}}
                                        icon={<ClockIcon aria-hidden="true" />}
                                    >
                                        Bruk et lagret søk
                                    </Button>
                                    <Button
                                        as={Link}
                                        to={`${CONTEXT_PATH}/favoritter`}
                                        type="button"
                                        variant="tertiary"
                                        onClick={() => {}}
                                        icon={<HeartIcon aria-hidden="true" />}
                                    >
                                        Mine favoritter
                                    </Button>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                    <SearchResultHeader
                        isFiltersVisible={isFiltersVisible}
                        searchResponse={searchResponse}
                        query={query}
                        queryDispatch={queryDispatch}
                    />
                    <div className="Search__flex container-large">
                        {(device === Device.DESKTOP || (device === Device.MOBILE && isFiltersVisible)) && (
                            <div className="Search__flex-left">
                                <FilterForm
                                    query={query}
                                    dispatchQuery={queryDispatch}
                                    initialSearchResult={initialSearchResponse.data}
                                    searchResult={searchResponse.data}
                                    fetchSearch={fetchSearch}
                                    isFilterModalOpen={isFiltersVisible}
                                    setIsFilterModalOpen={setIsFiltersVisible}
                                    device={device}
                                />
                            </div>
                        )}
                        <div className="Search__flex-right">
                            <SelectedFilters query={query} queryDispatch={queryDispatch} />
                            {searchResponse.status === FetchStatus.IS_FETCHING && query.from === 0 ? (
                                <LoadingScreen />
                            ) : (
                                <React.Fragment>
                                    <SearchResult
                                        initialSearchResponse={initialSearchResponse}
                                        searchResponse={searchResponse}
                                        query={query}
                                        queryDispatch={queryDispatch}
                                        loadMoreResults={loadMoreResults}
                                    />
                                    <DoYouWantToSaveSearch query={query} />
                                    <Feedback />
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                </React.Fragment>
            )}
        </div>
    );
};

export default Search;
