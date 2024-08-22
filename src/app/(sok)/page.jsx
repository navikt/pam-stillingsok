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

async function fetchPostcodes() {
    const res = await fetch(`${process.env.PAM_GEOGRAFI_API_URL}/postdata?sort=asc`, {
        headers: getDefaultHeaders(),
        next: { revalidate: 3600 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch postcode data");
    }

    const data = await res.json();

    return data.map((d) => ({
        postcode: d.postkode,
        city: d.by,
        municipality: d.kommune.navn,
        county: d.fylke.navn,
    }));
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
    const fetchCalls = [fetchCachedElasticSearch(toApiQuery(defaultQuery)), fetchLocations(), fetchPostcodes()];
    if (shouldDoExtraCallIfUserHasSearchParams) {
        fetchCalls.push(fetchCachedElasticSearch(toApiQuery(initialQuery)));
    }

    const [globalSearchResult, locations, postcodes, searchResult] = await Promise.all(fetchCalls);

    console.log("Postnummer:", postcodes.length);

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
