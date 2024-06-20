import Search from "@/app/(sok)/_components/Search";
import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/app/layout";
import { fetchCachedElasticSearch } from "@/app/(sok)/_utils/fetchCachedElasticSearch";
import * as actions from "@/app/_common/actions";
import { redirect } from "next/navigation";
import { migrateSearchParams } from "@/app/(sok)/_utils/searchParamsVersioning";
import toReadableQuery from "@/app/(sok)/_utils/toReadableQuery";
import toApiQuery, { defaultApiQuery } from "@/app/(sok)/_utils/toApiQuery";
import { SearchQueryParams, SEARCH_RESULTS_PER_PAGE } from "@/app/(sok)/_utils/constants";
import searchParamsToURLSearchParams from "@/app/(sok)/_utils/searchParamsToURLSearchParams";

export async function generateMetadata({ searchParams }) {
    const readableQuery = toReadableQuery(searchParamsToURLSearchParams(searchParams));
    let pageTitle;
    if (readableQuery) {
        pageTitle = getMetadataTitle(["Ledige stillinger", readableQuery].join(" - "));
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
    const migratedSearchParams = migrateSearchParams(searchParams);
    const searchParamsClone = migratedSearchParams || searchParams;

    if (migratedSearchParams !== undefined) {
        const urlSearchParams = searchParamsToURLSearchParams(migratedSearchParams);
        redirect(`?${urlSearchParams.toString()}`);
    }

    if (!searchParamsClone[SearchQueryParams.SIZE]) {
        const { resultsPerPage } = await actions.getUserPreferences();
        searchParamsClone[SearchQueryParams.SIZE] = resultsPerPage || SEARCH_RESULTS_PER_PAGE;
    }

    const apiQuery = toApiQuery(searchParamsClone);
    const shouldDoExtraCallIfUserHasSearchParams = Object.keys(searchParamsClone).length > 0;
    const fetchCalls = [fetchCachedElasticSearch(defaultApiQuery), fetchLocations()];

    if (shouldDoExtraCallIfUserHasSearchParams) {
        fetchCalls.push(fetchCachedElasticSearch(apiQuery));
    }

    const [globalSearchResult, locations, searchResult] = await Promise.all(fetchCalls);

    return (
        <Search
            searchResult={shouldDoExtraCallIfUserHasSearchParams ? searchResult : globalSearchResult}
            aggregations={globalSearchResult.aggregations}
            locations={locations}
        />
    );
}
