import { notFound } from "next/navigation";
import SearchWrapper from "../../migrating/use-client/SearchWrapper";
import simplifySearchResponse from "../../modules/common/api/SearchAPIUtils";
import { defaultQuery, stringifyQuery, toApiQuery } from "../../modules/sok/query";
import { createQuery } from "./(sok)/_components/query";

async function search(query) {
    const res = await fetch(`http://localhost:3000/stillinger/api/search${query}`);
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
    const res = await fetch("http://localhost:3000/stillinger/api/locations");
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
    const initialSearchResult = await search(stringifyQuery(toApiQuery(defaultQuery)));
    const result = await search(stringifyQuery(toApiQuery(initialQuery)));
    const locations = await getLocations();

    return (
        <SearchWrapper
            searchResponse={{ status: "SUCCESS", data: { ...result } }}
            initialSearchResponse={{ status: "SUCCESS", data: { ...initialSearchResult, locations } }}
            initialQuery={initialQuery}
        />
    );
}
