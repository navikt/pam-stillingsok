import { VStack } from "@navikt/ds-react";
import { type ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { Fragment, type ReactElement, useEffect, useRef } from "react";
import { track } from "@/app/_common/umami";
import type { SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import getWorkLocation from "@/app/stillinger/_common/utils/getWorkLocation";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { MAX_RESULT_WINDOW, SEARCH_CHUNK_SIZE } from "@/app/stillinger/(sok)/_utils/query";
import FavouritesButton from "@/app/stillinger/favoritter/_components/FavouritesButton";
import { SOKEHJELPER_SOURCE_PARAM, SOKEHJELPER_SOURCE_VALUE } from "@/features/sokehjelper/model/sokehjelperSource";
import SokehjelperFeedbackCard from "@/features/sokehjelper/ui/SokehjelperFeedbackCard/SokehjelperFeedbackCard";
import SearchResultItem from "./SearchResultItem";

// TODO(ARB-386): Fjern tilbakemeldingskortet og kilde=sokehjelper når A/B-testen er avsluttet.
// Kortet vises etter tredje treff (indeks 2), eller sist hvis det er færre treff
const FEEDBACK_CARD_AFTER_INDEX = 2;

interface SearchResultProps {
    searchResult: SearchResultType;
}

export default function SearchResult({ searchResult }: SearchResultProps): ReactElement | null {
    const query = useQuery();
    const searchParams = useSearchParams();
    const isDebug = searchParams.get("explain") === "true";
    const fromSokehjelper = searchParams.get(SOKEHJELPER_SOURCE_PARAM) === SOKEHJELPER_SOURCE_VALUE;

    const from = query.has(QueryNames.FROM) ? Number.parseInt(query.get(QueryNames.FROM) ?? "0", 10) : 0;

    const resultsPerPage = query.has(QueryNames.PAGE_COUNT)
        ? Number.parseInt(query.get(QueryNames.PAGE_COUNT) ?? `${SEARCH_CHUNK_SIZE}`, 10)
        : SEARCH_CHUNK_SIZE;

    const page = Math.floor(from / resultsPerPage) + 1;

    // Elastic search does not allow pagination above 10 000 results.
    const cappedTotalAds = Math.min(searchResult.totalAds, MAX_RESULT_WINDOW);
    const totalPages = Math.ceil(cappedTotalAds / resultsPerPage);

    const searchResultRef = useRef<HTMLDivElement>(null);

    /**
     * Set focus to top of result list when user paginate to next search result section
     */
    const previousPagingRef = useRef<Readonly<{
        from: number;
        pageCount: number;
    }> | null>(null);

    useEffect(() => {
        const currentPaging = {
            from,
            pageCount: resultsPerPage,
        };

        const previousPaging = previousPagingRef.current;

        if (
            previousPaging &&
            (previousPaging.from !== currentPaging.from || previousPaging.pageCount !== currentPaging.pageCount) &&
            searchResultRef.current
        ) {
            searchResultRef.current.focus({
                preventScroll: true,
            });
        }

        previousPagingRef.current = currentPaging;
    }, [from, resultsPerPage]);

    if (!searchResult.ads || searchResult.ads.length === 0) {
        track("Søk – null treff", { searchParams: getSearchParamsAsRecord(searchParams) });
        return fromSokehjelper ? <SokehjelperFeedbackCard /> : null;
    }

    return (
        <VStack
            as="section"
            gap="space-40"
            ref={searchResultRef}
            tabIndex={-1}
            aria-label={`Søketreff, side ${page} av ${totalPages}`}
            className="no-focus-outline"
        >
            {searchResult.ads.map((ad, index) => (
                <Fragment key={ad.uuid}>
                    <SearchResultItem
                        ad={ad}
                        favouriteButton={
                            <FavouritesButton
                                plassering="stillingsøk-resultatliste"
                                index={index}
                                page={page}
                                useShortText
                                className="SearchResultsItem__favourite-button"
                                stilling={{
                                    uuid: ad.uuid,
                                    source: ad.source,
                                    reference: ad.reference,
                                    title: ad.title,
                                    jobTitle: ad.jobTitle ?? "undefined",
                                    status: ad.status ?? "",
                                    applicationdue: ad.applicationDue ?? "",
                                    location: getWorkLocation(ad.locationList ?? null),
                                    employer: ad.employer?.name ?? "",
                                    published: ad.published,
                                    expires: ad.expires,
                                    hasSuperraskSoknad: ad.hasSuperraskSoknad === "true",
                                }}
                                id={ad.uuid}
                                hideText
                                variant="tertiary"
                            />
                        }
                        isDebug={isDebug}
                        isFavourites={false}
                    />
                    {fromSokehjelper && index === FEEDBACK_CARD_AFTER_INDEX && <SokehjelperFeedbackCard />}
                </Fragment>
            ))}
            {fromSokehjelper && searchResult.ads.length <= FEEDBACK_CARD_AFTER_INDEX && <SokehjelperFeedbackCard />}
        </VStack>
    );
}

function getSearchParamsAsRecord(params: ReadonlyURLSearchParams) {
    const paramsObj: Record<string, string[]> = {};
    params.forEach((value, key) => {
        if (!paramsObj[key]) {
            paramsObj[key] = [];
        }
        paramsObj[key].push(value);
    });
    return paramsObj;
}
