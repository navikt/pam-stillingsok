import { notFound } from "next/navigation";
import simplifySearchResponse from "../../_common/api/SearchAPIUtils";
import { defaultQuery, stringifyQuery, toApiQuery, toBrowserQuery } from "./_components/old_query";
import { createQuery } from "./_components/query";
import Search from "./_components/Search";

async function search(query) {
    const res = await fetch(`https://arbeidsplassen.intern.dev.nav.no/stillinger/api/search${query}`);
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    const data = await res.json();
    return simplifySearchResponse(data);
}

async function getLocations() {
    const res = await fetch("https://arbeidsplassen.intern.dev.nav.no/stillinger/api/locations");
    if (res.status === 404) {
        notFound();
    }
    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }
    return res.json();
}

export default async function Page({ searchParams }) {
    const initialQuery = createQuery(defaultQuery, searchParams);

    // An empty search aggregates all possible search filter
    const globalSearchResult = await search(stringifyQuery(toApiQuery(defaultQuery)));

    // Locations filter are not aggregated, but based on a predefined list
    const locations = await getLocations();

    // If user has some search criteria, make an extra search to get that result
    let searchResult;
    if (Object.keys(toBrowserQuery(initialQuery)).length > 0) {
        searchResult = await search(stringifyQuery(toApiQuery(initialQuery)));
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
