import React, { useEffect, useRef, useState } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import PropTypes from "prop-types";
import SearchResultItem from "@/app/(sok)/_components/searchResult/SearchResultItem";
import SearchPagination from "@/app/(sok)/_components/searchResult/SearchPagination";

export default function SearchResult({ searchResult }) {
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);
    const searchResultRef = useRef();

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

    /**
     * Set focus to top of result list when user paginate to next search result section
     */
    function setFocusTopOfSearchResult() {
        if (searchResultRef.current) {
            searchResultRef.current.focus({ preventScroll: true });
        }
    }

    return (
        <>
            {searchResult.ads && searchResult.ads.length > 0 && (
                <VStack
                    gap="10"
                    ref={searchResultRef}
                    tabIndex={-1}
                    aria-label="Søketreff"
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
            )}
            <SearchPagination searchResult={searchResult} setFocusTopOfSearchResult={setFocusTopOfSearchResult} />
        </>
    );
}

SearchResult.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
