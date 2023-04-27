import React, { useContext, useEffect, useState } from "react";
import { FetchStatus } from "../../../../common/hooks/useFetchReducer";
import ErrorMessage from "../../../../common/components/messages/ErrorMessage";
import Pagination from "../pagination/Pagination";
import SearchResultItem from "./SearchResultItem";
import "./SearchResult.css";
import FavouritesButton from "../../../favourites/components/FavouritesButton";
import LoadingScreen from "../loadingScreen/LoadingScreen";
import { AuthenticationContext, AuthenticationStatus } from "../../../auth/contexts/AuthenticationProvider";
import useRestoreScroll from "../../../../common/hooks/useRestoreScroll";

const SearchResult = ({ initialSearchResponse, searchResponse, query, loadMoreResults }) => {
    const { authenticationStatus } = useContext(AuthenticationContext);
    const { status, data } = searchResponse;
    const [lastAdIndex, setLastAdIndex] = useState();
    const [nextAdIndex, setNextAdIndex] = useState();

    useRestoreScroll("search-page", initialSearchResponse.status === FetchStatus.SUCCESS);

    /**
     * If user clicked "Load more" in the search result, move focus from
     * "Load more" button to the next item in the result list
     */
    useEffect(() => {
        setNextAdIndex(query.from > 0 ? lastAdIndex + 1 : undefined);
        setLastAdIndex(data.ads.length - 1);
    }, [data]);

    return (
        <section className="SearchResult">
            {status === FetchStatus.FAILURE && <ErrorMessage />}
            {status === FetchStatus.IS_FETCHING && query.from === 0 && <LoadingScreen />}
            {(status === FetchStatus.SUCCESS || (status === FetchStatus.IS_FETCHING && query.from > 0)) && (
                <React.Fragment>
                    {data.ads &&
                        data.ads.map((ad, index) => (
                            <SearchResultItem
                                shouldAutoFocus={index === nextAdIndex}
                                key={ad.uuid}
                                ad={ad}
                                favouriteButton={
                                    authenticationStatus === AuthenticationStatus.IS_AUTHENTICATED ? (
                                        <FavouritesButton
                                            useShortText={true}
                                            className="SearchResultsItem__favourite-button"
                                            stilling={ad}
                                            id={ad.uuid}
                                            hideText
                                        />
                                    ) : null
                                }
                            />
                        ))}
                    {data.ads && data.ads.length > 0 && (
                        <div className="SearchResult__footer">
                            <Pagination
                                query={query}
                                isSearching={status === FetchStatus.IS_FETCHING}
                                searchResult={data}
                                onLoadMoreClick={loadMoreResults}
                            />
                        </div>
                    )}
                </React.Fragment>
            )}
        </section>
    );
};

export default SearchResult;
