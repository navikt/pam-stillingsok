import React, { ReactElement, useEffect, useRef } from "react";
import { VStack } from "@navikt/ds-react";
import useQuery from "@/app/stillinger/(sok)/_components/QueryProvider";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { SEARCH_CHUNK_SIZE } from "@/app/stillinger/(sok)/_utils/query";
import InternalSearchResultItem from "./InternalSearchResultItem";
import { type SearchResult as SearchResultType } from "@/app/stillinger/_common/types/SearchResult";
import KarriereveiledningBanner from "@/app/stillinger/(sok)/_components/searchResult/KarriereveiledningBanner";
import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { track } from "@/app/_common/umami";

interface SearchResultProps {
    searchResult: SearchResultType;
}

export default function InternalSearchResult({ searchResult }: SearchResultProps): ReactElement | null {
    const query = useQuery();
    const searchParams = useSearchParams();

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
        track("Søk – null treff", { searchParams: getSearchParamsAsRecord(searchParams) });
        return null;
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
                <React.Fragment key={ad.uuid}>
                    {index === 9 && page === 1 && <KarriereveiledningBanner />}

                    <InternalSearchResultItem ad={ad} />
                </React.Fragment>
            ))}
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
