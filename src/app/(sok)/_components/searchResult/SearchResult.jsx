import React, { useEffect, useRef, useState } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import Divider from "@/app/(sok)/_components/searchResult/Divider";
import { SortByValues } from "@/app/(sok)/_components/searchResult/Sorting";
import PropTypes from "prop-types";
import SearchResultItem from "./SearchResultItem";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";

export default function SearchResult({ searchResult }) {
    const query = useQuery();
    const [isDebug, setIsDebug] = useState(false);
    const resultsPerPage = query.get(QueryNames.FROM) || SEARCH_CHUNK_SIZE;
    const totalPages = Math.ceil(searchResult.totalAds / resultsPerPage);
    const page = query.has(QueryNames.FROM) ? Math.floor(query.get(QueryNames.FROM) / resultsPerPage) + 1 : 1;
    const searchResultRef = useRef();
    const SCORE_THRESHOLD = 2;

    const indexOfLastWithScoreAboveThreshold = searchResult.ads?.findIndex((ad) => ad.score < SCORE_THRESHOLD);

    /**
     *  Check if we should render ad details for debug
     */
    useEffect(() => {
        try {
            const valueFromLocalStorage = localStorage.getItem("isDebug");
            if (valueFromLocalStorage && valueFromLocalStorage === "true") {
                setIsDebug(true);
            }
        } catch (err) {
            // ignore
        }
    }, []);

    /**
     * Set focus to top of result list when user paginate to next search result section
     */
    useEffect(() => {
        if (query.paginate && searchResultRef.current) {
            searchResultRef.current.focus({
                preventScroll: true,
            });
        }
    }, [query.paginate]);

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
            {searchResult.ads.map((ad, index) => (
                <React.Fragment key={ad.uuid}>
                    {isDebug &&
                        (!query.has(QueryNames.SORT) || query.get(QueryNames.SORT) === SortByValues.RELEVANT) && (
                            <Divider
                                index={index}
                                score={ad.score}
                                indexOfLastWithScoreAboveThreshold={indexOfLastWithScoreAboveThreshold}
                            />
                        )}
                    <SearchResultItem
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
                </React.Fragment>
            ))}
        </VStack>
    );
}

SearchResult.propTypes = {
    searchResult: PropTypes.shape({
        ads: PropTypes.arrayOf(PropTypes.shape({})),
    }),
};
