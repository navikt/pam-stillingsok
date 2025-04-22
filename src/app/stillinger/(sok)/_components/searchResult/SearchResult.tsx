import React, { ReactElement, useEffect, useRef } from "react";
import { BodyShort, Box, Heading, HGrid, Link as AkselLink, VStack } from "@navikt/ds-react";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import Divider from "@/app/stillinger/(sok)/_components/searchResult/Divider";
import { SortByValues } from "@/app/stillinger/(sok)/_components/searchResult/Sorting";
import { SEARCH_CHUNK_SIZE } from "@/app/stillinger/(sok)/_utils/query";
import SearchResultItem from "./SearchResultItem";
import useIsDebug from "@/app/stillinger/(sok)/_components/IsDebugProvider";
import { SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import FigureConfused from "@/app/_common/components/FigureConfused";

interface SearchResultProps {
    searchResult: SearchResultType;
}

export default function SearchResult({ searchResult }: SearchResultProps): ReactElement | null {
    const query = useQuery();
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
                    {isDebug &&
                        (!query.has(QueryNames.SORT) || query.get(QueryNames.SORT) === SortByValues.RELEVANT) &&
                        indexOfLastWithScoreAboveThreshold === index && <Divider />}
                    {index === 9 && page === 1 && (
                        <Box padding={{ xs: "4", md: "6" }} borderRadius="small" background="surface-alt-3-subtle">
                            <HGrid gap="4" columns="repeat(2, minmax(0, auto))" align="center">
                                <div>
                                    <Heading level="3" size="small" spacing>
                                        Trenger du hjelp til å finne en jobb?
                                    </Heading>

                                    <BodyShort spacing>
                                        På{" "}
                                        <AkselLink
                                            className="default-text-color-link"
                                            data-umami-event="Søkeresultat klikk karriereveiledning"
                                            href="https://karriereveiledning.no/karrierevalg/verktoy-soke-jobb"
                                        >
                                            Karriereveiledning.no
                                        </AkselLink>{" "}
                                        finner du tips og verktøy til jobbsøking. Du kan også få gratis veiledning på
                                        chat, telefon og e-post.
                                    </BodyShort>
                                </div>

                                <div>
                                    <FigureConfused />
                                </div>
                            </HGrid>
                        </Box>
                    )}

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
