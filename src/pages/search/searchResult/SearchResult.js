import React from "react";
import DelayedSpinner from "../../../components/spinner/DelayedSpinner";
import SearchResultCount from "./SearchResultCount";
import Sorting from "./Sorting";
import { FetchStatus } from "../../../hooks/useFetchReducer";
import ErrorMessage from "../../../components/messages/ErrorMessage";
import NoResults from "./NoResults";
import Pagination from "./Pagination";
import SkipToCriteria from "../skiplinks/SkipToCriteria";
import ArrowUpIcon from "../../../components/icons/ArrowUpIcon";
import SearchResultItem from "./SearchResultItem";
import "./SearchResult.less";
import FavouritesButton from "../../favourites/FavouritesButton";

const SearchResult = ({ searchResponse, queryDispatch, query, loadMoreResults }) => {
    const { status, data } = searchResponse;

    // If user clicked "Load more" in the search result, move focus from
    // "Load more" button to the next item in the result list
    const adToBeFocused = query.from > 0 && data ? data.ads[query.from] : undefined;

    return (
        <section id="resultat" className="SearchResult">
            <SkipToCriteria />
            <header className="SearchResult__header">
                <div>
                    <h2 className="Search__h2">Søkeresultat</h2>
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
                            <SearchResultItem
                                shouldAutoFocus={adToBeFocused && ad.uuid === adToBeFocused.uuid}
                                key={ad.uuid}
                                ad={ad}
                                favouriteButton={
                                    <FavouritesButton
                                        useShortText={true}
                                        className="SearchResultsItem__favourite-button"
                                        stilling={ad}
                                        id={ad.uuid}
                                    />
                                }
                            />
                        ))}
                    <div className="SearchResult__footer">
                        <Pagination
                            query={query}
                            isSearching={status === FetchStatus.IS_FETCHING}
                            searchResult={data}
                            onLoadMoreClick={loadMoreResults}
                        />

                        <a href="#main-content" className="SearchResult__skip-to-top link">
                            <ArrowUpIcon ariaHidden={true} />
                            Til toppen
                        </a>
                    </div>
                </React.Fragment>
            )}
        </section>
    );
};

export default SearchResult;
