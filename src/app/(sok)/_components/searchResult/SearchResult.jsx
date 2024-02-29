import React, { forwardRef, useEffect, useState } from "react";
import { VStack } from "@navikt/ds-react";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";
import SearchResultItem from "./SearchResultItem";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";

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

    if (searchResult.ads || searchResult.ads.length === 0) {
        return null;
    }

    return (
        <VStack
            gap="10"
            ref={ref}
            tabIndex={-1}
            aria-label={`Søketreff, side ${page} av ${totalPages}`}
            className="no-focus-outline"
        >
            {searchResult.ads.map((ad) => (
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
