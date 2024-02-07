import React from "react";
import PropTypes from "prop-types";
import Pagination from "../pagination/Pagination";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "../../../favoritter/_components/FavouritesButton";

function SearchResult({ searchResult, query, loadMoreResults, isDebug }) {
    return (
        <section className="SearchResult">
            {searchResult.ads &&
                searchResult.ads.map((ad) => (
                    <SearchResultItem
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
            {searchResult.ads && searchResult.ads.length > 0 && (
                <Pagination query={query} searchResult={searchResult} onLoadMoreClick={loadMoreResults} />
            )}
        </section>
    );
}

SearchResult.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
    query: PropTypes.shape({
        from: PropTypes.number,
    }),
    loadMoreResults: PropTypes.func.isRequired,
    isDebug: PropTypes.bool,
};

export default SearchResult;
