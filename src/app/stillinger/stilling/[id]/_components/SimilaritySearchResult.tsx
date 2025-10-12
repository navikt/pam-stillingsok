import React, { ReactElement, useRef } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import SearchResultItem from "@/app/stillinger/(sok)/_components/searchResult/SearchResultItem";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";

interface SimilaritySearchResultProps {
    searchResult: SimilaritySearchResultData;
    explain: boolean;
}

export default function SimilaritySearchResult({
    searchResult,
    explain,
}: SimilaritySearchResultProps): ReactElement | null {
    const searchResultRef = useRef<HTMLDivElement>(null);

    if (!searchResult.ads || searchResult.ads.length === 0) {
        return null;
    }

    return (
        <VStack
            as="section"
            gap="10"
            ref={searchResultRef}
            tabIndex={-1}
            aria-label={`Lignende annonser`}
            className="no-focus-outline"
        >
            {searchResult.ads.map((ad) => (
                <React.Fragment key={ad.uuid}>
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
                        isDebug={explain}
                        isFavourites={false}
                    />
                </React.Fragment>
            ))}
        </VStack>
    );
}
