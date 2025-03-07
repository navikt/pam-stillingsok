import { createQuery, defaultQuery, SEARCH_CHUNK_SIZE, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { fetchCachedSimplifiedElasticSearch } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import * as actions from "@/app/stillinger/_common/actions/index";
import { Button, VStack } from "@navikt/ds-react";
import Link from "next/link";
import React from "react";
import MaxQuerySizeExceeded from "@/app/stillinger/_common/components/MaxQuerySizeExceeded";
import { fetchCachedPostcodes, Postcode } from "@/app/stillinger/(sok)/_utils/fetchPostcodes";
import SearchWrapper from "@/app/stillinger/(sok)/_components/SearchWrapper";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { unstable_cache } from "next/cache";
import { logTextSearch } from "@/app/stillinger/_common/monitoring/search-logging";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/constants/layout";
import {
    FETCH_FYLKER_ERROR,
    FETCH_KOMMUNER_ERROR,
    FetchError,
    FetchResult,
} from "@/app/stillinger/(sok)/_utils/fetchTypes";
import logger from "@/app/stillinger/_common/utils/logger";
import { SearchResult } from "@/app/stillinger/_common/types/SearchResult";

const MAX_QUERY_SIZE = 10000;

export async function generateMetadata() {
    const pageTitle = getMetadataTitle("Ledige stillinger");
    return {
        title: pageTitle,
        description: defaultMetadataDescription,
        openGraph: {
            title: pageTitle,
            description: defaultMetadataDescription,
            images: [defaultOpenGraphImage],
        },
    };
}

const fetchCachedLocations = unstable_cache(async () => fetchLocations(), ["locations-query"], {
    revalidate: 10,
});

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

async function fetchLocations(): Promise<FetchResult<SearchLocation[]>> {
    const [kommunerRespons, fylkerRespons] = await Promise.all([
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/kommuner`, {
            headers: getDefaultHeaders(),
        }),
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/fylker`, {
            headers: getDefaultHeaders(),
        }),
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
        return {
            errors,
            data: [],
        };
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
            {
                key: "UTLAND",
                code: "999",
                municipals: [],
            },
        ],
    };
}

export default async function Page({ searchParams }: { searchParams: Record<string, string | string[] | undefined> }) {
    if (typeof searchParams === "object" && "from" in searchParams && searchParams.from) {
        const size = searchParams.size ? searchParams.size : 25;
        if (Number(searchParams.from) + Number(size) > MAX_QUERY_SIZE) {
            return (
                <VStack align="center">
                    <MaxQuerySizeExceeded />
                    <Button variant="primary" as={Link} role="link" href="/stillinger">
                        Gå til søket
                    </Button>
                </VStack>
            );
        }
    }

    const userPreferences = await actions.getUserPreferences();
    const modifiedSearchParams = searchParams;

    let resultsPerPage = SEARCH_CHUNK_SIZE;

    if (userPreferences.resultsPerPage) {
        modifiedSearchParams.size = userPreferences.resultsPerPage.toString();
        resultsPerPage = userPreferences.resultsPerPage;
    }

    const fetchCalls: { [K in keyof FetchResults]: Promise<FetchResults[K]> } = {
        globalSearchResult: fetchCachedSimplifiedElasticSearch(toApiQuery(defaultQuery)),
        locationsResult: fetchCachedLocations(),
        postcodesResult: fetchCachedPostcodes(),
    } as const;

    const searchParamsKeysWithoutVersion = Object.keys(searchParams).filter((key) => key !== QueryNames.URL_VERSION);
    const hasQueryParams = searchParamsKeysWithoutVersion.some((name) => Object.values(QueryNames).includes(name));
    if (hasQueryParams) {
        fetchCalls.searchResult = fetchCachedSimplifiedElasticSearch(toApiQuery(createQuery(modifiedSearchParams)));
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

    await logTextSearch(modifiedSearchParams);

    const searchResultData = hasQueryParams && searchResult ? searchResult.data : globalSearchResult.data;
    if (searchResultData == null) {
        return Promise.reject("Søk mangler data");
    }

    const aggregations = globalSearchResult.data?.aggregations;

    if (!aggregations) {
        return Promise.reject("Søk mangler aggregations");
    }

    return (
        <SearchWrapper
            searchResult={searchResultData}
            aggregations={aggregations}
            locations={locationsResult.data || []}
            postcodes={postcodesResult.data || []}
            resultsPerPage={resultsPerPage}
            errors={errors}
        />
    );
}
