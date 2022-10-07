import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { captureException } from "@sentry/browser";
import { CONTEXT_PATH } from "../../environment";
import { AuthenticationContext, AuthenticationStatus } from "../Authentication/AuthenticationProvider";
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
import SearchAPI from "../../api/SearchAPI/SearchAPI";
import ErrorMessage from "../../components/Messages/ErrorMessage";
import SearchForm from "./SearchForm/SearchForm";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import useTrackPageview from "../../hooks/useTrackPageview";
import LinkMenu from "./LinkMenu/LinkMenu";
import LoadingScreen from "./LoadingScreen/LoadingScreen";
import useRestoreScroll from "../../hooks/useRestoreScroll";
import "./Search.css";
import { useHistory } from "react-router";
import SearchResult from "./SearchResult/SearchResult";
import H1WithAutoFocus from "../../components/H1WithAutoFocus/H1WithAutoFocus";
import EventBanner from "./EventBanner/EventBanner";

const Search = () => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const [query, queryDispatch] = useReducer(queryReducer, initialQuery, initQueryWithValuesFromBrowserUrl);
    const [initialSearchDone, setInitialSearchDone] = useState(false);
    const [searchResponse, searchDispatch] = useFetchReducer();
    const latestSearch = useRef();
    let history = useHistory();

    useDocumentTitle("Ledige stillinger");
    useTrackPageview(CONTEXT_PATH, "Ledige stillinger");
    useRestoreScroll("search-page", initialSearchDone);

    /**
     * Make an initial search when view is shown.
     * Search again when user changes a search criteria.
     */
    useEffect(() => {
        fetchSearch();
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
                    setInitialSearchDone(true);
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

    return (
        <React.Fragment>
            <H1WithAutoFocus className="Search__h1">Ledige stillinger</H1WithAutoFocus>
            {authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED && <LinkMenu />}

            {!initialSearchDone && searchResponse.status === FetchStatus.FAILURE && <ErrorMessage />}
            {!initialSearchDone && searchResponse.status === FetchStatus.IS_FETCHING && <LoadingScreen />}
            {initialSearchDone && (
                <div className="Search__flex-wrapper">
                    <div>
                        <SearchForm
                            query={query}
                            dispatchQuery={queryDispatch}
                            searchResult={searchResponse.data}
                            fetchSearch={fetchSearch}
                        />
                        <EventBanner />
                    </div>
                    <SearchResult
                        searchResponse={searchResponse}
                        query={query}
                        queryDispatch={queryDispatch}
                        loadMoreResults={loadMoreResults}
                    />
                </div>
            )}
        </React.Fragment>
    );
};

export default Search;
