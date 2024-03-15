import elasticSearchRequestBody from "@/app/(sok)/_utils/elasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import simplifySearchResponse from "@/app/(sok)/_utils/simplifySearchResponse";
import { unstable_cache } from "next/cache";

export const fetchCachedElasticSearch = unstable_cache(
    async (query) => fetchElasticSearch(query),
    ["elastic-search-query"],
    {
        revalidate: 30,
    },
);

async function fetchElasticSearch(query) {
    const body = elasticSearchRequestBody(query);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error("Failed to fetch data");
    }

    const data = await res.json();

    return simplifySearchResponse(data);
}
