import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/app/layout";
import {
    createQuery,
    defaultQuery,
    SEARCH_CHUNK_SIZE,
    stringifyQuery,
    toApiQuery,
    toBrowserQuery,
} from "@/app/(sok)/_utils/query";
import { fetchSimplifiedCachedElasticSearch } from "@/app/(sok)/_utils/fetchSimplifiedCachedElasticSearch";
import * as actions from "@/app/_common/actions";
import { redirect } from "next/navigation";
import { migrateSearchParams } from "@/app/(sok)/_utils/searchParamsVersioning";
import { Button, VStack } from "@navikt/ds-react";
import Link from "next/link";
import React from "react";
import MaxQuerySizeExceeded from "@/app/_common/components/MaxQuerySizeExceeded";
import { fetchCachedPostcodes } from "@/app/(sok)/_utils/fetchPostcodes";
import SearchWrapper from "@/app/(sok)/_components/SearchWrapper";

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

async function fetchLocations() {
    const [response1, response2] = await Promise.all([
        fetch(`${process.env.PAMADUSER_URL}/api/v1/geography/municipals`, { next: { revalidate: 3600 } }),
        fetch(`${process.env.PAMADUSER_URL}/api/v1/geography/counties`, { next: { revalidate: 3600 } }),
    ]);

    if (!response1.ok || !response2.ok) {
        throw new Error("Failed to fetch data");
    }

    const municipals = await response1.json();
    const counties = await response2.json();

    return [
        ...counties.map((c) => ({
            key: c.name,
            code: c.code,
            municipals: municipals
                .filter((m) => m.countyCode === c.code)
                .map((m) => ({
                    key: `${c.name}.${m.name}`,
                    code: m.code,
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
    const newSearchParams = migrateSearchParams(searchParams);

    if (newSearchParams !== undefined) {
        const newQuery = {
            ...createQuery(newSearchParams),
            saved: newSearchParams.saved,
        };
        redirect(stringifyQuery(toBrowserQuery(newQuery)));
    }

    const userPreferences = await actions.getUserPreferences();
    const modifiedSearchParams = searchParams;
    let resultsPerPage = SEARCH_CHUNK_SIZE;
    if (userPreferences.resultsPerPage) {
        modifiedSearchParams.size = userPreferences.resultsPerPage;
        resultsPerPage = userPreferences.resultsPerPage;
    }

    const initialQuery = createQuery(modifiedSearchParams);

    const shouldDoExtraCallIfUserHasSearchParams = Object.keys(toBrowserQuery(initialQuery)).length > 0;
    const fetchCalls = [
        fetchSimplifiedCachedElasticSearch(toApiQuery(defaultQuery)),
        fetchLocations(),
        fetchCachedPostcodes(),
    ];
    if (shouldDoExtraCallIfUserHasSearchParams) {
        fetchCalls.push(fetchSimplifiedCachedElasticSearch(toApiQuery(initialQuery)));
    }

    const [globalSearchResult, locations, postcodes, searchResult] = await Promise.all(fetchCalls);

    return (
        <SearchWrapper
            searchResult={shouldDoExtraCallIfUserHasSearchParams ? searchResult : globalSearchResult}
            aggregations={globalSearchResult.aggregations}
            locations={locations}
            postcodes={postcodes}
            resultsPerPage={resultsPerPage}
        />
    );
}
