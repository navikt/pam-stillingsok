import { createQuery, SEARCH_CHUNK_SIZE, SearchQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { z } from "zod";
import React from "react";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { unstable_cache } from "next/cache";
import { logTextSearch } from "@/app/stillinger/_common/monitoring/search-logging";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import {
    FETCH_FYLKER_ERROR,
    FETCH_KOMMUNER_ERROR,
    FetchError,
    FetchResult,
} from "@/app/stillinger/(sok)/_utils/fetchTypes";
import logger from "@/app/stillinger/_common/utils/logger";
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { Metadata } from "next";
import { SearchParams } from "next/dist/server/request/search-params";
import { getDirApiOboHeaders } from "@/app/muligheter/_common/auth/auth";
import { fetchCachedSimplifiedInternalOpenSearch } from "@/app/muligheter/(sok)/_utils/fetchInternalOpenSearch";
import { notFound } from "next/navigation";
import InternalSearchWrapper from "@/app/muligheter/(sok)/InternalSearchWrapper";

const MAX_QUERY_SIZE = 10000;

export const metadata: Metadata = {
    title: "Ledige stillinger",
    description: "Søk etter ledige jobber. Her har vi samlet ledige stillinger fra hele Norge.",
};

const fetchCachedLocations = unstable_cache(
    async () => {
        const headers = await getDefaultHeaders();
        headers.set("Nav-CallId", "");
        return fetchLocations(headers);
    },
    ["locations-query"],
    { revalidate: 10 },
);

type Municipal = { key: string; code: string };
export type SearchLocation = {
    key: string;
    code: string;
    municipals: Municipal[];
};
type KommuneRaw = {
    kommunenummer: string;
    navn: string;
    fylkesnummer: string;
    korrigertNavn: string;
};

type FylkeRaw = {
    fylkesnummer: string;
    navn: string;
    korrigertNavn: string;
};
type FetchResults = {
    globalSearchResult: FetchResult<SearchResult>;
    locationsResult: FetchResult<SearchLocation[]>;
    postcodesResult: FetchResult<Postcode[]>;
    searchResult?: FetchResult<SearchResult> | undefined;
};

async function fetchLocations(headers: HeadersInit): Promise<FetchResult<SearchLocation[]>> {
    const [kommunerRespons, fylkerRespons] = await Promise.all([
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/kommuner`, { headers }),
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/fylker`, { headers }),
    ]);

    const errors: FetchError[] = [];

    if (!kommunerRespons.ok) {
        logger.error(`Feilet å hente kommuner: ${kommunerRespons.status} ${kommunerRespons.statusText}`);
        errors.push({ type: FETCH_KOMMUNER_ERROR });
    }

    if (!fylkerRespons.ok) {
        logger.error(`Feilet å hente fylker: ${fylkerRespons.status} ${fylkerRespons.statusText}`);
        errors.push({ type: FETCH_FYLKER_ERROR });
    }

    if (errors.length > 0) {
        return { errors, data: [] };
    }

    const municipals: KommuneRaw[] = await kommunerRespons.json();
    const counties: FylkeRaw[] = await fylkerRespons.json();

    return {
        data: [
            ...counties.map((c) => ({
                key: c.navn,
                code: c.fylkesnummer,
                municipals: municipals
                    .filter((m) => m.fylkesnummer === c.fylkesnummer)
                    .map((m) => ({
                        key: `${c.navn}.${m.navn}`,
                        code: m.fylkesnummer,
                    })),
            })),
            { key: "UTLAND", code: "999", municipals: [] },
        ],
    };
}

export default async function Page(props: { searchParams: Promise<SearchParams> }) {
    const searchParams = await props.searchParams;
    let resultsPerPage = SEARCH_CHUNK_SIZE;

    const pageCountSchema = z.coerce.number().int().min(1).max(100);

    const parsedPageCount = (() => {
        const candidate = Array.isArray(searchParams?.pageCount) ? searchParams?.pageCount[0] : searchParams?.pageCount;
        const res = pageCountSchema.safeParse(candidate);
        return res.success ? res.data : undefined;
    })();
    if (parsedPageCount !== undefined) {
        resultsPerPage = parsedPageCount;
    }

    if (typeof searchParams === "object" && "from" in searchParams && searchParams.from) {
        if (Number(searchParams.from) + Number(resultsPerPage) > MAX_QUERY_SIZE) {
            return <MaxQuerySizeExceeded goBackToSearchUrl="/stillinger" />;
        }
    }

    const globalSearchQuery: SearchQuery = createQuery({ size: resultsPerPage.toString() });
    const userSearchQuery: SearchQuery = createQuery({ ...searchParams, size: resultsPerPage.toString() });

    let headers;

    try {
        headers = await getDirApiOboHeaders();
    } catch {
        notFound();
    }

    const fetchCalls: { [K in keyof FetchResults]: Promise<FetchResults[K]> } = {
        globalSearchResult: fetchCachedSimplifiedInternalOpenSearch(toApiQuery(globalSearchQuery), headers),
        locationsResult: fetchCachedLocations(),
        postcodesResult: fetchCachedPostcodes(),
    } as const;

    const searchParamsKeysWithoutVersion = Object.keys(searchParams).filter((key) => key !== QueryNames.URL_VERSION);
    const hasQueryParams = searchParamsKeysWithoutVersion.some((name) => Object.values(QueryNames).includes(name));
    if (hasQueryParams) {
        fetchCalls.searchResult = fetchCachedSimplifiedInternalOpenSearch(toApiQuery(userSearchQuery), headers);
    }

    const results = await Promise.all(Object.values(fetchCalls));

    const fetchResults: FetchResults = Object.keys(fetchCalls).reduce((acc, key, index) => {
        return {
            ...acc,
            [key]: results[index],
        };
    }, {} as FetchResults);

    const { globalSearchResult, locationsResult, postcodesResult, searchResult } = fetchResults;

    const errors = Object.values(fetchResults)
        .filter((result): result is { errors: FetchError[] } => result.errors != null)
        .flatMap((result) => result.errors);

    await logTextSearch(searchParams);

    const searchResultData = hasQueryParams && searchResult ? searchResult.data : globalSearchResult.data;
    if (searchResultData == null) {
        return Promise.reject("Søk mangler data");
    }

    const aggregations = globalSearchResult.data?.aggregations;

    if (!aggregations) {
        return Promise.reject("Søk mangler aggregations");
    }

    return (
        <InternalSearchWrapper
            searchResult={searchResultData}
            aggregations={aggregations}
            locations={locationsResult.data || []}
            postcodes={postcodesResult.data || []}
            resultsPerPage={resultsPerPage}
            errors={errors}
            removeStuffForTest={false}
        />
    );
}
