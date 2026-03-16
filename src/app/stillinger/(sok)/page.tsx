import { createQuery, SEARCH_CHUNK_SIZE, SearchQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { z } from "zod";
import React from "react";
import MaxQuerySizeExceeded from "@/app/stillinger/(sok)/_components/maxQuerySizeExceeded/MaxQuerySizeExceeded";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import SearchWrapper from "@/app/stillinger/(sok)/_components/SearchWrapper";
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
import { type SearchResult } from "@/app/stillinger/_common/types/SearchResult";
import { Metadata } from "next";
import { appLogger } from "@/app/_common/logging/appLogger";
import { UrlSearchParams } from "@/types/routing";
import { SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { buildSearchComboboxOptions } from "@/app/stillinger/(sok)/_components/searchBox/searchComboboxOptions";

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
        appLogger.httpError(`Feilet å hente kommuner`, {
            method: "GET",
            url: kommunerRespons.url,
            status: kommunerRespons.status,
            statusText: kommunerRespons.statusText,
        });
        errors.push({ type: FETCH_KOMMUNER_ERROR });
    }

    if (!fylkerRespons.ok) {
        appLogger.httpError(`Feilet å hente fylker`, {
            method: "GET",
            url: fylkerRespons.url,
            status: fylkerRespons.status,
            statusText: fylkerRespons.statusText,
        });
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
                label: c.korrigertNavn,
                municipals: municipals
                    .filter((m) => m.fylkesnummer === c.fylkesnummer)
                    .map((m) => ({
                        key: `${c.navn}.${m.navn}`,
                        label: m.korrigertNavn,
                        code: m.fylkesnummer,
                    })),
            })),
            { key: "UTLAND", code: "999", label: "", municipals: [] },
        ],
    };
}

export type PagingValidationError =
    | {
          readonly reason: "invalid_results_per_page";
      }
    | {
          readonly reason: "invalid_from";
      }
    | {
          readonly reason: "max_result_window_exceeded";
          readonly from: number;
      };

export default async function Page(props: { searchParams: Promise<UrlSearchParams> }) {
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

    const rawFrom = Array.isArray(searchParams.from) ? searchParams.from[0] : searchParams.from;
    const parsedFrom = z.coerce
        .number()
        .int()
        .min(0)
        .safeParse(rawFrom ?? 0);

    if (!parsedFrom.success) {
        appLogger.warn("Avviser ugyldig from for stillingssøk", {
            component: "SearchPage",
            rawFrom,
            resultsPerPage,
        });

        return <MaxQuerySizeExceeded goBackToSearchUrl="/stillinger" />;
    }

    if (parsedFrom.data + resultsPerPage > MAX_QUERY_SIZE) {
        appLogger.warn("Avviser for dyp paginering for stillingssøk", {
            component: "SearchPage",
            from: parsedFrom.data,
            rawFrom,
            resultsPerPage,
            sort: Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort,
            version: Array.isArray(searchParams.v) ? searchParams.v[0] : searchParams.v,
        });

        return <MaxQuerySizeExceeded goBackToSearchUrl="/stillinger" />;
    }

    const globalSearchQuery: SearchQuery = createQuery({ size: resultsPerPage.toString() });
    const userSearchQuery: SearchQuery = createQuery({ ...searchParams, size: resultsPerPage.toString() });

    const headers = await getDefaultHeaders();
    const fetchCalls: { [K in keyof FetchResults]: Promise<FetchResults[K]> } = {
        globalSearchResult: fetchCachedSimplifiedElasticSearch(toApiQuery(globalSearchQuery), headers),
        locationsResult: fetchCachedLocations(),
        postcodesResult: fetchCachedPostcodes(),
    } as const;

    const searchParamsKeysWithoutVersion = Object.keys(searchParams).filter((key) => key !== QueryNames.URL_VERSION);
    const hasQueryParams = searchParamsKeysWithoutVersion.some((name) => Object.values(QueryNames).includes(name));
    if (hasQueryParams) {
        fetchCalls.searchResult = fetchCachedSimplifiedElasticSearch(toApiQuery(userSearchQuery), headers);
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

    const locations = locationsResult.data || [];
    const postcodes = postcodesResult.data || [];
    const searchBoxOptions = buildSearchComboboxOptions(aggregations, locations);

    return (
        <SearchWrapper
            searchResult={searchResultData}
            aggregations={aggregations}
            locations={locations}
            postcodes={postcodes}
            searchBoxOptions={searchBoxOptions}
            resultsPerPage={resultsPerPage}
            errors={errors}
        />
    );
}
