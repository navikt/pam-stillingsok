import React, { ReactElement, useEffect, useRef } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { SEARCH_CHUNK_SIZE } from "@/app/stillinger/(sok)/_utils/query";
import SearchResultItem from "./SearchResultItem";
import useIsDebug from "@/app/_common/debug-provider/IsDebugProvider";
import { SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import KarriereveiledningBanner from "@/app/stillinger/(sok)/_components/searchResult/KarriereveiledningBanner";

interface SearchResultProps {
    searchResult: SearchResultType;
}

export default function SearchResult({ searchResult }: SearchResultProps): ReactElement | null {
    const query = useQuery();
    const { isDebug } = useIsDebug();
    const { isFavourites } = false;

    const resultsPerPage: number = query.has(QueryNames.FROM)
        ? parseInt(query.get(QueryNames.FROM)!, 10)
        : SEARCH_CHUNK_SIZE;

    const totalPages = Math.ceil(searchResult.totalAds / resultsPerPage);
    const page = query.has(QueryNames.FROM)
        ? Math.floor(parseInt(query.get(QueryNames.FROM)!) / resultsPerPage) + 1
        : 1;

    const searchResultRef = useRef<HTMLDivElement>(null);

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
            {searchResult.ads.map((ad, index) => (
                <React.Fragment key={ad.uuid}>
                    {index === 9 && page === 1 && <KarriereveiledningBanner />}

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
                        isFavourites={isFavourites}
                    />
                </React.Fragment>
            ))}
        </VStack>
    );
}
