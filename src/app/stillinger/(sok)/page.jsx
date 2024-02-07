import simplifySearchResponse from "./_utils/simplifySearchResponse";
import { defaultQuery, toApiQuery, toBrowserQuery } from "./_utils/old_query";
import Search from "./_components/Search";
import elasticSearchRequestBody from "./_utils/elasticSearchRequestBody";
import { createQuery } from "./_utils/query";

async function fetchElasticSearch(query) {
    const body = elasticSearchRequestBody(query);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return simplifySearchResponse(data);
}

async function fetchLocations() {
    const [response1, response2] = await Promise.all([
        fetch(`${process.env.PAMADUSER_URL}/api/v1/geography/municipals`),
        fetch(`${process.env.PAMADUSER_URL}/api/v1/geography/counties`),
    ]);

    if (!response1.ok || !response2.ok) {
        throw new Error("Failed to fetch data");
    }

    const municipals = await response1.json();
    const counties = await response2.json();

    const result = [
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

    return result;
}

export default async function Page({ searchParams }) {
    const initialQuery = createQuery(defaultQuery, searchParams);

    // An empty search aggregates all possible search filter
    const globalSearchResult = await fetchElasticSearch(toApiQuery(defaultQuery));

    // Locations filter are not aggregated, but based on a predefined list
    const locations = await fetchLocations();

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
