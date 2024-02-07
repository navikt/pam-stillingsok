import React, { useEffect, useRef } from "react";
import { FetchAction, FetchStatus, useFetchReducer } from "../../app/_common/hooks/useFetchReducer";
import SearchAPI from "../../app/_common/api/SearchAPI";
import {
    defaultQuery,
    initQueryWithValuesFromBrowserUrl,
    toApiQuery,
    toBrowserQuery,
} from "../../app/stillinger/(sok)/_components/old_query";
import logAmplitudeEvent from "../../app/_common/tracking/amplitude";
import Search from "../../app/stillinger/(sok)/_components/Search";
import useRestoreScroll from "../../app/_common/hooks/useRestoreScroll";
import "../../app/stillinger/(sok)/_components/search.css";
import useDocumentTitle from "../../app/_common/hooks/useDocumentTitle";

function SearchPage() {
    const [initialSearchResponse, initialSearchDispatch] = useFetchReducer();
    const [searchResponse, searchDispatch] = useFetchReducer();
    const latestSearch = useRef();
    const initialQuery = initQueryWithValuesFromBrowserUrl(defaultQuery);

    const { resetScroll } = useRestoreScroll("search-page", initialSearchResponse.status === FetchStatus.SUCCESS);

    useDocumentTitle("Ledige stillinger");

    /**
     * Når man laster inn flere annonser, kan en allerede lastet annonse komme på nytt. Dette kan f.eks skje
     * ved at annonser legges til/slettes i backend, noe som fører til at pagineringen og det faktiske datasettet
     * blir usynkronisert. Funskjonen fjerner derfor duplikate annonser i søkeresultatet.
     */
    function mergeAndRemoveDuplicates(searchResponseLocal, response) {
        return {
            ...response,
            ads: [
                ...searchResponse.data.ads,
                ...response.ads.filter((a) => {
                    const duplicate = searchResponseLocal.data.ads.find((b) => a.uuid === b.uuid);
                    return !duplicate;
                }),
            ],
        };
    }

    function fetchInitialSearch() {
        initialSearchDispatch({ type: FetchAction.BEGIN });

        const promises = [
            SearchAPI.initialSearch(toApiQuery(defaultQuery)), // An empty search aggregates search criteria across all ads
            SearchAPI.getLocations(), // Search criteria for locations are not aggregated, but based on a predefined list
        ];

        // If user has some search criteria in browser url, make an extra search to get that result
        if (Object.keys(toBrowserQuery(initialQuery)).length > 0) {
            promises.push(SearchAPI.search(toApiQuery(initialQuery)));
        }

        Promise.all(promises).then(
            (responses) => {
                const [initialSearchResult, locations, searchResult] = responses;
                searchDispatch({ type: FetchAction.RESOLVE, data: searchResult || initialSearchResult });
                initialSearchDispatch({ type: FetchAction.RESOLVE, data: { ...initialSearchResult, locations } });
            },
            (error) => {
                initialSearchDispatch({ type: FetchAction.REJECT, error });
            },
        );
    }

    function fetchSearch(query) {
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

    /**
     * Make an initial search when view is shown.
     * Search again when user changes a search criteria.
     */
    useEffect(() => {
        fetchInitialSearch();
        logAmplitudeEvent("Stillinger - Utførte søk");
    }, []);

    useEffect(() => {
        const numberOfSelectedFilters = Object.keys(toBrowserQuery(initialQuery)).length;
        if (numberOfSelectedFilters === 0) {
            resetScroll();
        }
    }, []);

    let isDebug = false;
    try {
        const valueFromLocalStorage = localStorage.getItem("isDebug");
        if (valueFromLocalStorage && valueFromLocalStorage === "true") {
            isDebug = true;
        }
    } catch (err) {
        // ignore
    }

    return (
        <Search
            searchResult={searchResponse}
            initialSearchResult={initialSearchResponse}
            query={initialQuery}
            fetchSearch={fetchSearch}
            isDebug={isDebug}
        />
    );
}

export default SearchPage;
