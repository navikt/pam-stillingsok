import { createQuery, defaultQuery, SEARCH_CHUNK_SIZE, toApiQuery } from "@/app/(sok)/_utils/query";
import { fetchCachedSimplifiedElasticSearch } from "@/app/(sok)/_utils/fetchElasticSearch";
import * as actions from "@/app/_common/actions";
import { Button, VStack } from "@navikt/ds-react";
import Link from "next/link";
import React from "react";
import MaxQuerySizeExceeded from "@/app/_common/components/MaxQuerySizeExceeded";
import { fetchCachedPostcodes } from "@/app/(sok)/_utils/fetchPostcodes";
import SearchWrapper from "@/app/(sok)/_components/SearchWrapper";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { unstable_cache } from "next/cache";
import { logTextSearch } from "@/app/_common/monitoring/search-logging";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";
import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/constants/layout";

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
    revalidate: 3600,
});

async function fetchLocations() {
    const [response1, response2] = await Promise.all([
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/kommuner`, {
            headers: getDefaultHeaders(),
        }),
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/fylker`, {
            headers: getDefaultHeaders(),
        }),
    ]);

    if (!response1.ok || !response2.ok) {
        throw new Error("Failed to fetch data");
    }

    const municipals = await response1.json();
    const counties = await response2.json();

    return [
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
            municipals: [],
            code: 999,
        },
    ];
}

export default async function Page({ searchParams }) {
    if (searchParams.from) {
        const size = searchParams.size ? searchParams.size : 25;
        if (Number(searchParams.from) + Number(size) > MAX_QUERY_SIZE) {
            return (
                <VStack align="center">
                    <MaxQuerySizeExceeded />
                    <Button variant="primary" as={Link} role="link" href="/">
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
        modifiedSearchParams.size = userPreferences.resultsPerPage;
        resultsPerPage = userPreferences.resultsPerPage;
    }

    const fetchCalls = [
        fetchCachedSimplifiedElasticSearch(toApiQuery(defaultQuery)),
        fetchCachedLocations(),
        fetchCachedPostcodes(),
    ];

    const searchParamsKeysWithoutVersion = Object.keys(searchParams).filter((key) => key !== QueryNames.URL_VERSION);
    const hasQueryParams = searchParamsKeysWithoutVersion.some((name) => Object.values(QueryNames).includes(name));
    if (hasQueryParams) {
        fetchCalls.push(fetchCachedSimplifiedElasticSearch(toApiQuery(createQuery(modifiedSearchParams))));
    }

    const fetchResults = await Promise.all(fetchCalls);
    const [globalSearchResult, locations, postcodes, searchResult] = fetchResults;
    const errors = fetchResults
        .filter((result) => result.errors)
        .map((result) => result.errors)
        .flat();

    await logTextSearch(modifiedSearchParams);

    return (
        <SearchWrapper
            searchResult={hasQueryParams ? searchResult.data : globalSearchResult.data}
            aggregations={globalSearchResult.data.aggregations}
            locations={locations}
            postcodes={postcodes.data}
            resultsPerPage={resultsPerPage}
            errors={errors}
        />
    );
}
