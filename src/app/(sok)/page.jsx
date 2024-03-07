import simplifySearchResponse from "@/app/(sok)/_utils/simplifySearchResponse";
import { defaultMetadataDescription, defaultOpenGraphImage, getMetadataTitle } from "@/app/layout";
import { createQuery, defaultQuery, toApiQuery, toBrowserQuery, toReadableQuery } from "@/app/(sok)/_utils/query";
import elasticSearchRequestBody from "@/app/(sok)/_utils/elasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import Search from "@/app/(sok)/_components/Search2";

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

async function fetchElasticSearch(query) {
    const body = elasticSearchRequestBody(query);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(body),
        next: { revalidate: 30 },
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return simplifySearchResponse(data);
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
    const initialQuery = createQuery(searchParams);

    // An empty search aggregates all possible search filter
    const globalSearchResult = await fetchElasticSearch(toApiQuery(defaultQuery));

    // Locations filter are not aggregated, but based on a predefined list
    const locations = {};

    // If user has some search criteria, make an extra search to get that result
    let searchResult;
    if (Object.keys(toBrowserQuery(initialQuery)).length > 0) {
        searchResult = await fetchElasticSearch(toApiQuery(initialQuery));
    } else {
        searchResult = globalSearchResult;
    }

    return (
        <Search
            searchResult={searchResult}
            aggregations={globalSearchResult.aggregations}
            locations={locations}
            query={initialQuery}
        />
    );
}
