import React, { ReactElement, useEffect, useRef } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/favoritter/_components/FavouritesButton";
import useQuery from "@/app/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import Divider from "@/app/(sok)/_components/searchResult/Divider";
import { SortByValues } from "@/app/(sok)/_components/searchResult/Sorting";
import { SEARCH_CHUNK_SIZE } from "../../_utils/query";
import SearchResultItem from "./SearchResultItem";
import SearchResultItemAi from "./SearchResultItemAi";
import useIsDebug from "@/app/(sok)/_components/IsDebugProvider";
import { SearchResult as SearchResultType } from "@/app/(sok)/_types/SearchResult";

interface SearchResultProps {
    // eslint-disable-next-line
    aiSearchData: any;
    searchResult: SearchResultType;
}

export default function SearchResult({ aiSearchData, searchResult }: SearchResultProps): ReactElement | null {
    const query = useQuery();
    const showSearchAi = query.has("ai");
    const { isDebug } = useIsDebug();

    const resultsPerPage: number = query.has(QueryNames.FROM)
        ? parseInt(query.get(QueryNames.FROM)!, 10)
        : SEARCH_CHUNK_SIZE;

    const totalPages = Math.ceil(searchResult.totalAds / resultsPerPage);
    const page = query.has(QueryNames.FROM)
        ? Math.floor(parseInt(query.get(QueryNames.FROM)!) / resultsPerPage) + 1
        : 1;

    const searchResultRef = useRef<HTMLDivElement>(null);

    const SCORE_THRESHOLD = 1;

    const indexOfLastWithScoreAboveThreshold = searchResult.ads?.findIndex(
        (ad) => ad.score && ad.score < SCORE_THRESHOLD,
    );

    if (showSearchAi) {
        console.log("AI HITS", aiSearchData);
    }

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
            as="section"
            gap="10"
            ref={searchResultRef}
            tabIndex={-1}
            aria-label={`Søketreff, side ${page} av ${totalPages}`}
            className="no-focus-outline"
        >
            {showSearchAi
                ? // eslint-disable-next-line
                  aiSearchData?.value.map((ad: any, index: any) => (
                      <React.Fragment key={index}>
                          <SearchResultItemAi
                              ad={ad}
                              favouriteButton={
                                  <FavouritesButton
                                      useShortText
                                      className="SearchResultsItem__favourite-button"
                                      // eslint-disable-next-line
                                      stilling={ad as any}
                                      id={ad.uuid}
                                      hideText
                                      variant="tertiary"
                                  />
                              }
                              isDebug={isDebug}
                          />
                      </React.Fragment>
                  ))
                : searchResult.ads.map((ad, index) => (
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
                                      // eslint-disable-next-line
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
