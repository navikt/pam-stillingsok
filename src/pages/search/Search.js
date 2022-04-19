import React, { useContext, useEffect, useReducer, useRef } from "react";
import { Link } from "react-router-dom";
import { CONTEXT_PATH } from "../../environment";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import RestoreScroll from "../../components/restoreScroll/RestoreScroll";
import SearchResultCount from "./searchResultCount/SearchResultCount";
import ShowResultsButton from "./showResultsButton/ShowResultsButton";
import Sorting from "./sorting/Sorting";
import { useTrackPageview } from "../../hooks";
import SearchErrorBox from "../../components/searchErrorBox/SearchErrorBox";
import { AuthenticationContext, AuthenticationStatus } from "../../context/AuthenticationProvider";
import queryReducer, {
    initialQuery,
    initQueryWithValuesFromBrowserUrl,
    isSearchQueryEmpty,
    SET_FROM,
    toApiQuery,
    toBrowserQuery
} from "./query";
import { extractParam, stringifyQueryObject } from "../../components/utils";
import { FetchAction, FetchStatus, useFetchReducer } from "../../hooks/useFetchReducer";
import { apiFetchLocations, apiSearch } from "../../api/search/api";
import ErrorMessage from "../../components/messages/ErrorMessage";
import PageHeader from "../../components/pageHeader/PageHeader";
import SearchCriteria from "./searchCriteria/SearchCriteria";
import SaveSearchButton from "../savedSearches/SaveSearchButton";
import { Knapp } from "@navikt/arbeidsplassen-knapper";
import NoResults from "./noResults/NoResults";
import SearchResultItem from "./searchResults/SearchResultsItem";
import Pagination from "./pagination/Pagination";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import "./Search.less";

const Search = () => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [query, dispatchQuery] = useReducer(queryReducer, initialQuery, initQueryWithValuesFromBrowserUrl);
    const [initialSearchResponse, initialSearchDispatch] = useFetchReducer();
    const [searchResponse, searchDispatch] = useFetchReducer();
    const latestSearch = useRef();

    useDocumentTitle("Ledige stillinger");
    useTrackPageview(CONTEXT_PATH, "Ledige stillinger");

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

        window.history.replaceState({}, "", CONTEXT_PATH + stringifyQueryObject(browserQuery));
    }, [query]);

    /**
     * Fetches available search criteria, locations
     * and an initial search result
     */
    function fetchInitialSearch() {
        initialSearchDispatch({ type: FetchAction.BEGIN });

        const promises = [
            apiSearch(), // An empty search aggregates search criteria across all ads
            apiFetchLocations() // Search criteria for locations are not aggregated, but based on a predefined list
        ];

        // If user has some search criteria in browser url,
        // we must make an extra search to get that result
        const apiQuery = toApiQuery(query);
        if (Object.keys(apiQuery).length > 0) {
            promises.push(apiSearch(apiQuery));
        }

        Promise.all(promises)
            .then((responses) => {
                const [initialSearchResult, locations, searchResult] = responses;
                initialSearchDispatch({ type: FetchAction.RESOLVE, data: { ...initialSearchResult, locations } });
                searchDispatch({ type: FetchAction.RESOLVE, data: searchResult ? searchResult : initialSearchResult });
            })
            .catch((error) => {
                initialSearchDispatch({ type: FetchAction.REJECT, error });
            });
    }

    /**
     * Fetches search result.
     */
    function fetchSearch() {
        searchDispatch({ type: FetchAction.BEGIN });
        const search = apiSearch(toApiQuery(query));

        // To avoid race conditions, when multiple search are done simultaneously,
        // we handle only the latest search response
        latestSearch.current = search;

        search
            .then((response) => {
                if (latestSearch.current === search) {
                    // If user clicked the load more button, search result
                    // will be merged into already loaded data.
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
        dispatchQuery({ type: SET_FROM, value: query.from + query.size });
    }

    /**
     * Når man laster inn flere annonser, kan en allerede lastet annonse komme på nytt. Dette kan f.eks skje
     * ved at annonser legges til/slettes i backend, noe som fører til at pagineringen og det faktiske datasettet
     * blir usynkronisert. Funskjonen fjerner derfor duplikate annonser i søkeresultatet.
     */
    function mergeAndRemoveDuplicates(searchResponse, response) {
        return {
            ...searchResponse.data,
            stillinger: {
                ...searchResponse.data.stillinger,
                ...response.data.stillinger.filter((a) => {
                    const duplicate = searchResponse.data.stillinger.find((b) => a.uuid === b.uuid);
                    return !duplicate;
                })
            }
        };
    }

    const { status, data } = searchResponse;

    return (
        <div className="Search">
            <PageHeader title="Ledige stillinger" />

            {initialSearchResponse.status === FetchStatus.SUCCESS && (
                <ShowResultsButton searchResults={data} searchFailed={status === FetchStatus.FAILURE} />
            )}

            <div className="Search__inner">
                {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && (
                    <div className="Search__links-to-favourites-and-saved-search">
                        <Link to={`${CONTEXT_PATH}/favoritter`} className="link Search__favourites-link">
                            Favoritter
                        </Link>
                        <Link to={`${CONTEXT_PATH}/lagrede-sok`} className="link Search__saved-search-link">
                            Lagrede søk
                        </Link>
                    </div>
                )}
                <div className="Search__main">
                    {initialSearchResponse.status === FetchStatus.FAILURE && <SearchErrorBox />}
                    {initialSearchResponse.status === FetchStatus.IS_FETCHING && <DelayedSpinner />}
                    {initialSearchResponse.status === FetchStatus.SUCCESS && (
                        <RestoreScroll id="search-scroll">
                            <section id="sok" className="Search__criteria" aria-labelledby="search-form-title">
                                <SearchCriteria
                                    query={query}
                                    dispatchQuery={dispatchQuery}
                                    initialSearchResult={initialSearchResponse.data}
                                    searchResult={searchResponse.data}
                                    fetchSearch={fetchSearch}
                                />
                                <div className="Search__reset-and-save-search">
                                    <SaveSearchButton query={query} />
                                    <Knapp
                                        className="Search__nullstill"
                                        onClick={() => {
                                            dispatchQuery({ type: "RESET" });
                                        }}
                                    >
                                        Nullstill søk
                                    </Knapp>
                                </div>
                            </section>
                            <section id="resultat" aria-label="Søkeresultat" className="Search__result">
                                <header className="Search__count-and-sorting">
                                    <SearchResultCount searchResult={data} />
                                    <Sorting dispatch={dispatchQuery} query={query} />
                                </header>

                                {status === FetchStatus.FAILURE && <ErrorMessage />}
                                {status === FetchStatus.IS_FETCHING && query.from === 0 && <DelayedSpinner />}
                                {status === FetchStatus.SUCCESS && data.total.value === 0 && (
                                    <NoResults query={query} />
                                )}
                                {(status === FetchStatus.SUCCESS ||
                                    (status === FetchStatus.IS_FETCHING && query.from > 0)) && (
                                    <React.Fragment>
                                        {data.stillinger &&
                                            data.stillinger.map((stilling) => (
                                                <SearchResultItem key={stilling.uuid} stilling={stilling} />
                                            ))}

                                        <Pagination
                                            query={query}
                                            isSearching={status === FetchStatus.IS_FETCHING}
                                            searchResult={data}
                                            onLoadMoreClick={loadMoreResults}
                                        />
                                    </React.Fragment>
                                )}
                            </section>
                        </RestoreScroll>
                    )}
                </div>

                {initialSearchResponse.status === FetchStatus.SUCCESS && (
                    <div className="Search__til-toppen">
                        <a href="#top" className="link">
                            Til toppen
                        </a>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
