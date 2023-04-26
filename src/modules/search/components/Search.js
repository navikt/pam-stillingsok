import React, { useEffect, useReducer, useRef, useState } from "react";
import { CONTEXT_PATH } from "../../../common/environment";
import queryReducer, {
    initialQuery,
    initQueryWithValuesFromBrowserUrl,
    isSearchQueryEmpty,
    SET_FROM,
    stringifyQuery,
    toApiQuery,
    toBrowserQuery,
    toReadableQuery
} from "../query";
import { extractParam, formatNumber } from "../../../common/components/utils";
import { FetchAction, FetchStatus, useFetchReducer } from "../../../common/hooks/useFetchReducer";
import SearchAPI from "../../../common/api/SearchAPI";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import SearchForm from "./searchForm/SearchForm";
import LoadingScreen from "./loadingScreen/LoadingScreen";
import useRestoreScroll from "../../../common/hooks/useRestoreScroll";
import "./Search.css";
import { useHistory } from "react-router";
import SearchResult from "./searchResult/SearchResult";
import H1WithAutoFocus from "../../../common/components/h1WithAutoFocus/H1WithAutoFocus";
import { Heading } from "@navikt/ds-react";
import DoYouWantToSaveSearch from "./howToPanels/DoYouWantToSaveSearch";
import HowToAddFavourites from "./howToPanels/HowToAddFavourites";
import EmptyState from "./emptyState/EmptyState";
import Sorting from "./searchResult/Sorting";
import SelectedFilters from "./selectedFilters/SelectedFilters";
import Feedback from "./feedback/Feedback";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";

const Search = () => {
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery, initQueryWithValuesFromBrowserUrl);
    const [showEmptyState, setShowEmptyState] = useState(true);
    const [initialSearchResponse, initialSearchDispatch] = useFetchReducer();
    const [searchResponse, searchDispatch] = useFetchReducer();
    const latestSearch = useRef();
    const numberOfSelectedFilters = Object.keys(toBrowserQuery(query)).length;

    let history = useHistory();

    useRestoreScroll(
        "search-page",
        initialSearchResponse.status === FetchStatus.SUCCESS && numberOfSelectedFilters > 0
    );

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

    const readableQueryFullLength = toReadableQuery(query);
    const readableQuery =
        readableQueryFullLength.length > 60
            ? `${readableQueryFullLength.substring(0, 70)} (...)`
            : readableQueryFullLength;

    return (
        <div className="mb-4">
            <H1WithAutoFocus className="container-medium  Search__h1">Søk i ledige jobber</H1WithAutoFocus>
            {initialSearchResponse.status === FetchStatus.FAILURE && <ErrorMessage />}
            {initialSearchResponse.status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
            {initialSearchResponse.status === FetchStatus.SUCCESS && (
                <React.Fragment>
                    <SearchForm
                        query={query}
                        dispatchQuery={queryDispatch}
                        initialSearchResult={initialSearchResponse.data}
                        searchResult={searchResponse.data}
                        fetchSearch={fetchSearch}
                        setShowEmptyState={setShowEmptyState}
                    />
                    {numberOfSelectedFilters === 0 && showEmptyState ? (
                        <EmptyState totalPositions={initialSearchResponse.data.totalPositions} />
                    ) : (
                        <React.Fragment>
                            <div className="container-medium">
                                <SelectedFilters query={query} queryDispatch={queryDispatch} />
                            </div>
                            <div className="Search__number-of-hits-and-sorting-wrapper">
                                <div className="container-medium Search__number-of-hits-and-sorting">
                                    {searchResponse && searchResponse.data && searchResponse.data.totalAds >= 0 && (
                                        <Heading level="2" size="small" role="status">
                                            {`Søkeresultat: ${formatNumber(searchResponse.data.totalAds)} treff`}
                                        </Heading>
                                    )}
                                    <Sorting dispatch={queryDispatch} query={query} />
                                </div>
                            </div>
                            <div className="container-medium">
                                <SearchResult
                                    searchResponse={searchResponse}
                                    query={query}
                                    queryDispatch={queryDispatch}
                                    loadMoreResults={loadMoreResults}
                                />
                                <DoYouWantToSaveSearch query={query} />
                                <HowToAddFavourites />
                                <Feedback />
                            </div>
                        </React.Fragment>
                    )}
                </React.Fragment>
            )}
        </div>
    );
};

export default Search;
