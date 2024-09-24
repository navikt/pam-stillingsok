import React, { ReactElement, useEffect, useRef, useState } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import useSearchQuery from "@/app/(sok)/_components/SearchQueryProvider";
import { FROM } from "@/app/(sok)/_components/searchParamNames";
import SearchResultInterface from "@/app/(sok)/_types/SearchResult";
import SearchResultItem from "./SearchResultItem";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";

interface SearchResultProps {
    searchResult: SearchResultInterface;
}

export default function SearchResult({ searchResult }: SearchResultProps): ReactElement {
    const searchQuery = useSearchQuery();
    const [showAdDetailsForDebugging, setShowAdDetailsForDebugging] = useState(false);
    const resultsPerPage = searchQuery.has(FROM) ? parseInt(searchQuery.get(FROM)!, 10) : SEARCH_CHUNK_SIZE;
    const totalPages = Math.ceil(searchResult.totalAds / resultsPerPage);
    const page = searchQuery.has(FROM) ? Math.floor(parseInt(searchQuery.get(FROM)!, 10) / resultsPerPage) + 1 : 1;
    const searchResultRef = useRef<HTMLElement>();

    /**
     *  Check if we should render ad details for debug
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
    useEffect(() => {
        if (searchQuery.paginate && searchResultRef.current) {
            searchResultRef.current.focus({
                preventScroll: true,
            });
        }
    }, [searchQuery.paginate]);

    return (
        // @ts-expect-error VStack virker med ref, selv om typescript gir valideringsfeil
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
