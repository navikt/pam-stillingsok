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

export default async function Page({ searchParams }) {
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
    const fetchCalls = [fetchCachedElasticSearch(toApiQuery(defaultQuery)), fetchLocations()];
    if (shouldDoExtraCallIfUserHasSearchParams) {
        fetchCalls.push(fetchCachedElasticSearch(toApiQuery(initialQuery)));
    }

    const [globalSearchResult, locations, searchResult] = await Promise.all(fetchCalls);

    return (
        <Search
            searchResult={shouldDoExtraCallIfUserHasSearchParams ? searchResult : globalSearchResult}
            aggregations={globalSearchResult.aggregations}
            locations={locations}
            query={initialQuery}
        />
    );
}
