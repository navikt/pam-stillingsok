import React, { MutableRefObject, ReactElement, useEffect, useRef, useState } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import Divider from "@/app/(sok)/_components/searchResult/Divider";
import { SortByValues } from "@/app/(sok)/_components/searchResult/Sorting";
import { StillingFraSokeresultatDTO } from "@/app/lib/stillingSoekSchema";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";
import SearchResultItem from "./SearchResultItem";

interface SearchResultProps {
    searchResult: { totalAds: number; ads: StillingFraSokeresultatDTO[] };
}

export default function SearchResult({ searchResult }: SearchResultProps): ReactElement | null {
    const query = useQuery();
    const [isDebug, setIsDebug] = useState(false);

    const resultsPerPage: string = query.has(QueryNames.FROM)
        ? query.get(QueryNames.FROM)!
        : SEARCH_CHUNK_SIZE.toString();

    const totalPages = Math.ceil(searchResult.totalAds / parseInt(resultsPerPage, 10));
    const page = query.has(QueryNames.FROM)
        ? Math.floor(parseInt(query.get(QueryNames.FROM)!) / parseInt(resultsPerPage, 10)) + 1
        : 1;

    // TODO: Jeg fant ikke riktig type for useRef, så lot den være any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const searchResultRef: MutableRefObject<any> = useRef();

    const SCORE_THRESHOLD = 1;

    const indexOfLastWithScoreAboveThreshold = searchResult.ads?.findIndex(
        (ad) => ad.score && ad.score < SCORE_THRESHOLD,
    );

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
            {searchResult.ads.map((ad: StillingFraSokeresultatDTO, index: number) => (
                <React.Fragment key={ad.uuid}>
                    {isDebug &&
                        (!query.has(QueryNames.SORT) || query.get(QueryNames.SORT) === SortByValues.RELEVANT) &&
                        indexOfLastWithScoreAboveThreshold === index && <Divider />}
                    <SearchResultItem
                        ad={ad}
                        favouriteButton={
                            <FavouritesButton
                                useShortText
                                className="SearchResultsItem__favourite-button"
                                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                stilling={ad as any}
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
