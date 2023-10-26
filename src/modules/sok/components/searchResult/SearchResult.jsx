import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { FetchStatus } from "../../../common/hooks/useFetchReducer";
import ErrorMessage from "../../../common/components/messages/ErrorMessage";
import Pagination from "../pagination/Pagination";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "../../../favoritter/components/FavouritesButton";
import DelayedSpinner from "../../../common/components/spinner/DelayedSpinner";

function SearchResult({ searchResponse, query, loadMoreResults, isDebug }) {
    const { status, data } = searchResponse;
    const [lastAdIndex, setLastAdIndex] = useState();
    const [nextAdIndex, setNextAdIndex] = useState();

    /**
     * If user clicked "Load more" in the search result, move focus from
     * "Load more" button to the next item in the result list
     */
    useEffect(() => {
        if (data && data.ads) {
            setNextAdIndex(query.from > 0 ? lastAdIndex + 1 : undefined);
            setLastAdIndex(data.ads.length - 1);
        }
    }, [data]);

    return (
        <section className="SearchResult">
            {status === FetchStatus.FAILURE && <ErrorMessage />}
            {status === FetchStatus.IS_FETCHING && query.from === 0 && <DelayedSpinner />}
            {(status === FetchStatus.SUCCESS || (status === FetchStatus.IS_FETCHING && query.from > 0)) && (
                <>
                    {data.ads &&
                        data.ads.map((ad, index) => (
                            <SearchResultItem
                                shouldAutoFocus={index === nextAdIndex}
                                key={ad.uuid}
                                ad={ad}
                                favouriteButton={
                                    <FavouritesButton
                                        useShortText
                                        className="SearchResultsItem__favourite-button"
                                        stilling={ad}
                                        id={ad.uuid}
                                        hideText
                                        variant="tertiary"
                                    />
                                }
                                isDebug={isDebug}
                            />
                        ))}
                    {data.ads && data.ads.length > 0 && (
                        <Pagination
                            query={query}
                            isSearching={status === FetchStatus.IS_FETCHING}
                            searchResult={data}
                            onLoadMoreClick={loadMoreResults}
                        />
                    )}
                </>
            )}
        </section>
    );
}

SearchResult.propTypes = {
    searchResponse: PropTypes.shape({
        data: PropTypes.shape({
            ads: PropTypes.arrayOf(PropTypes.shape({})),
        }),
        status: PropTypes.string,
    }),
    query: PropTypes.shape({
        from: PropTypes.number,
    }),
    loadMoreResults: PropTypes.func.isRequired,
    isDebug: PropTypes.bool,
};

export default SearchResult;
