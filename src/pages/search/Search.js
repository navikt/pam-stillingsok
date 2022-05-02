import React, { useContext, useEffect, useReducer, useRef } from "react";
import { captureException } from "@sentry/browser";
import { CONTEXT_PATH } from "../../environment";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import SearchResultCount from "./searchResultCount/SearchResultCount";
import Sorting from "./sorting/Sorting";
import { AuthenticationContext, AuthenticationStatus } from "../../context/AuthenticationProvider";
import queryReducer, {
    initialQuery,
    initQueryWithValuesFromBrowserUrl,
    isSearchQueryEmpty,
    SET_FROM,
    stringifyQuery,
    toApiQuery,
    toBrowserQuery
} from "./query";
import { extractParam } from "../../components/utils";
import { FetchAction, FetchStatus, useFetchReducer } from "../../hooks/useFetchReducer";
import SearchAPI from "../../api/SearchAPI";
import ErrorMessage from "../../components/messages/ErrorMessage";
import PageHeader from "../../components/pageHeader/PageHeader";
import SearchForm from "./searchForm/SearchForm";
import NoResults from "./noResults/NoResults";
import Pagination from "./pagination/Pagination";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import SkipToCriteria from "./skiplinks/SkipToCriteria";
import LinkMenu from "./linkMenu/LinkMenu";
import LoadingScreen from "./loadingScreen/LoadingScreen";
import SkipToResult from "./skiplinks/SkipToResult";
import useRestoreScroll from "../../hooks/useRestoreScroll";
import "./Search.less";
import ArrowUpIcon from "../../components/icons/ArrowUpIcon";
import { useHistory } from "react-router";
import SearchResultItem from "./searchResultItem/SearchResultItem";

const Search = () => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery, initQueryWithValuesFromBrowserUrl);
    const [initialSearchResponse, initialSearchDispatch] = useFetchReducer();
    const [searchResponse, searchDispatch] = useFetchReducer();
    const latestSearch = useRef();
    let history = useHistory();

    useDocumentTitle("Ledige stillinger");
    useTrackPageview(CONTEXT_PATH, "Ledige stillinger");
    useRestoreScroll("search-page", initialSearchResponse.status === FetchStatus.SUCCESS);

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

        history.replace(CONTEXT_PATH + stringifyQuery(browserQuery));
    }, [query]);

    function fetchInitialSearch() {
        initialSearchDispatch({ type: FetchAction.BEGIN });

        const promises = [
            SearchAPI.search(), // An empty search aggregates search criteria across all ads
            SearchAPI.getAndCache("api/locations") // Search criteria for locations are not aggregated, but based on a predefined list
        ];

        // If user has some search criteria in browser url, make an extra search to get that result
        if (Object.keys(toBrowserQuery(query)).length > 0) {
            promises.push(SearchAPI.search(toApiQuery(query)));
        }

        Promise.all(promises)
            .then((responses) => {
                const [initialSearchResult, locations, searchResult] = responses;
                searchDispatch({ type: FetchAction.RESOLVE, data: searchResult ? searchResult : initialSearchResult });
                initialSearchDispatch({ type: FetchAction.RESOLVE, data: { ...initialSearchResult, locations } });
            })
            .catch((error) => {
                captureException(error);
                initialSearchDispatch({ type: FetchAction.REJECT, error });
            });
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
                    captureException(error);
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

    const { status, data } = searchResponse;

    return (
        <React.Fragment>
            <PageHeader title="Ledige stillinger" />
            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && <LinkMenu />}

            {initialSearchResponse.status === FetchStatus.FAILURE && <ErrorMessage />}
            {initialSearchResponse.status === FetchStatus.IS_FETCHING && <LoadingScreen />}
            {initialSearchResponse.status === FetchStatus.SUCCESS && (
                <div className="Search__wrapper">
                    <section id="sok" className="Search__criteria" aria-labelledby="search-form-title">
                        <SkipToResult data={searchResponse.data} />
                        <h2 className="Search__form-title" id="search-form-title">
                            Søk
                        </h2>
                        <SearchForm
                            query={query}
                            dispatchQuery={queryDispatch}
                            initialSearchResult={initialSearchResponse.data}
                            searchResult={searchResponse.data}
                            fetchSearch={fetchSearch}
                        />
                    </section>
                    <section id="resultat" aria-labelledby="search-result-h2" className="Search__result">
                        <header className="Search__count-and-sorting">
                            <SkipToCriteria />
                            <div>
                                <h2 className="Search__h2" id="search-result-h2">
                                    Søkeresultat
                                </h2>
                                <SearchResultCount searchResult={data} />
                            </div>
                            <Sorting dispatch={queryDispatch} query={query} />
                        </header>

                        {status === FetchStatus.FAILURE && <ErrorMessage />}
                        {status === FetchStatus.IS_FETCHING && query.from === 0 && <DelayedSpinner />}
                        {status === FetchStatus.SUCCESS && data.totalAds === 0 && <NoResults query={query} />}
                        {(status === FetchStatus.SUCCESS || (status === FetchStatus.IS_FETCHING && query.from > 0)) && (
                            <React.Fragment>
                                {data.ads &&
                                    data.ads.map((ad) => (
                                        <SearchResultItem key={ad.uuid} ad={ad} useSmallFavouriteButton={true} />
                                    ))}

                                <Pagination
                                    query={query}
                                    isSearching={status === FetchStatus.IS_FETCHING}
                                    searchResult={data}
                                    onLoadMoreClick={loadMoreResults}
                                />

                                <div className="Search__til-toppen">
                                    <a href="#top" className="link">
                                        <ArrowUpIcon ariaHidden={true} />
                                        Til toppen
                                    </a>
                                </div>
                            </React.Fragment>
                        )}
                    </section>
                </div>
            )}
        </React.Fragment>
    );
};

export default Search;
