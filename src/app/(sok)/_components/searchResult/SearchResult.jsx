import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Pagination from "@/app/(sok)/_components/pagination/Pagination";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";

function SearchResult({ searchResult, query, loadMoreResults }) {
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);

    /**
     *  Check if we should render ad details for debugging
     */
    useEffect(() => {
        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setShowAdDetailsForDebugging(true);
            }
        } catch (err) {
            // ignore
        }
    }, []);

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
                        isDebug={showAdDetailsForDebugging}
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
};

export default SearchResult;
