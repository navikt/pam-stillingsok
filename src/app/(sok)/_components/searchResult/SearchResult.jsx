import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import useSearchQuery from "@/app/(sok)/_components/SearchStateProvider";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import PropTypes from "prop-types";
import SearchResultItem from "./SearchResultItem";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";

export default function SearchResult({ searchResult }) {
    const searchQuery = useSearchQuery();
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);
    const resultsPerPage = searchQuery.get(FROM) || SEARCH_CHUNK_SIZE;
    const totalPages = Math.ceil(searchResult.totalAds / resultsPerPage);
    const page = searchQuery.has(FROM) ? Math.floor(searchQuery.get(FROM) / resultsPerPage) + 1 : 1;
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
    useLayoutEffect(() => {
        if (searchQuery.paginate && searchResultRef.current) {
            searchResultRef.current.focus({
                preventScroll: false,
            });
        }
    }, [searchQuery.paginate]);

    if (!searchResult.ads || searchResult.ads.length === 0) {
        return null;
    }

    return (
        <VStack
            gap="10"
            ref={searchResultRef}
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
}

SearchResult.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
