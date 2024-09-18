import Search from "@/app/(sok)/_components/Search";
import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/app/layout";
import {
    createQuery,
    defaultQuery,
    stringifyQuery,
    toApiQuery,
    toBrowserQuery,
    toReadableQuery,
} from "@/app/(sok)/_utils/query";
import { fetchCachedElasticSearch } from "@/app/(sok)/_utils/fetchCachedElasticSearch";
import * as actions from "@/app/_common/actions";
import { redirect } from "next/navigation";
import { migrateSearchParams } from "@/app/(sok)/_utils/searchParamsVersioning";
import { Button, VStack } from "@navikt/ds-react";
import Link from "next/link";
import React from "react";
import MaxQuerySizeExceeded from "@/app/_common/components/MaxQuerySizeExceeded";
import { fetchCachedPostcodes } from "@/app/(sok)/_utils/fetchPostcodes";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";

const MAX_QUERY_SIZE = 10000;

export async function generateMetadata({ searchParams }) {
    const query = createQuery(searchParams);
    const readableQuery = toReadableQuery(query);
    let pageTitle;
    if (readableQuery) {
        pageTitle = getMetadataTitle(["Ledige stillinger", toReadableQuery(query)].join(" - "));
    } else {
        pageTitle = getMetadataTitle("Ledige stillinger");
    }
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
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/kommuner`, {
            next: { revalidate: 3600 },
            headers: getDefaultHeaders(),
        }),
        fetch(`${process.env.PAM_GEOGRAFI_API_URL}/fylker`, {
            next: { revalidate: 3600 },
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
    if (userPreferences.resultsPerPage) {
        modifiedSearchParams.size = userPreferences.resultsPerPage;
    }

    const initialQuery = createQuery(modifiedSearchParams);

    const shouldDoExtraCallIfUserHasSearchParams = Object.keys(toBrowserQuery(initialQuery)).length > 0;
    const fetchCalls = [fetchCachedElasticSearch(toApiQuery(defaultQuery)), fetchLocations(), fetchCachedPostcodes()];
    if (shouldDoExtraCallIfUserHasSearchParams) {
        fetchCalls.push(fetchCachedElasticSearch(toApiQuery(initialQuery)));
    }

    const [globalSearchResult, locations, postcodes, searchResult] = await Promise.all(fetchCalls);

    return (
        <Search
            searchResult={shouldDoExtraCallIfUserHasSearchParams ? searchResult : globalSearchResult}
            aggregations={globalSearchResult.aggregations}
            locations={locations}
            postcodes={postcodes}
            query={initialQuery}
        />
    );
}
