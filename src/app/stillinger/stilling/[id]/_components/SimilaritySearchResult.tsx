import React, { ReactElement, useRef } from "react";
import { VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import SearchResultItem from "@/app/stillinger/(sok)/_components/searchResult/SearchResultItem";
import { SimilaritySearchResultData } from "@/app/stillinger/stilling/[id]/_similarity_search/simplifySearchResponse";
import { StillingSoekElement } from "@/server/schemas/stillingSearchSchema";

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
        <VStack as="section" gap="10" ref={searchResultRef} aria-label={`Lignende annonser`}>
            {searchResult.ads.map((ad, index: number) => (
                <React.Fragment key={ad.uuid}>
                    <SearchResultItem
                        ad={{ ...ad, published: undefined, applicationDue: undefined }}
                        favouriteButton={
                            <FavouritesButton
                                useShortText
                                className="SearchResultsItem__favourite-button"
                                stilling={ad as StillingSoekElement}
                                id={ad.uuid}
                                hideText
                                variant="tertiary"
                            />
                        }
                        isDebug={explain}
                        isFavourites={false}
                        position={index}
                        fromSimilaritySearch={true}
                    />
                </React.Fragment>
            ))}
        </VStack>
    );
}
