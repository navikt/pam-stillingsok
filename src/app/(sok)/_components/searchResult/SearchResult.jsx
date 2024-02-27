import React, { forwardRef, useEffect, useState } from "react";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "../../../favoritter/_components/FavouritesButton";
import { VStack } from "@navikt/ds-react";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";

export default forwardRef(function SearchResult({ searchResult, query }, ref) {
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);
    const resultsPerPage = query.size || SEARCH_CHUNK_SIZE;
    const totalPages = Math.ceil(searchResult.totalAds / resultsPerPage);
    const page = query.from ? Math.floor(query.from / resultsPerPage) + 1 : 1;

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
        <VStack
            gap="10"
            ref={ref}
            tabIndex={-1}
            aria-label={`Side ${page} av ${totalPages}`}
            className="no-focus-outline"
        >
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
        </VStack>
    );
});
