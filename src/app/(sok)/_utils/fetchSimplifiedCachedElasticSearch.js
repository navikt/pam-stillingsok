import elasticSearchRequestBody from "@/app/(sok)/_utils/elasticSearchRequestBody";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import simplifySearchResponse from "@/app/(sok)/_utils/simplifySearchResponse";
import { unstable_cache } from "next/cache"; // eslint-disable-line
import { elasticSearchDurationHistogram, incrementElasticSearchRequests } from "@/metrics";
import { fetchLocationsWithinDrivingDistance } from "@/app/(sok)/_utils/fetchLocationsWithinDrivingDistance";

/*
Manually cached because Next.js won't cache it. We break these:
    * The fetch request comes after the usage of headers or cookies.
    * The fetch request uses Authorization or Cookie headers and there's an uncached request above it in the component tree.
    https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#opting-out-of-data-caching

We can't use the built-in 'cache' in React either, since the route segment is dynamic:
    "... If the segment is dynamic, the output of the request will not be cached and will be re-fetched on every request when the segment is rendered."
    https://nextjs.org/docs/app/building-your-application/data-fetching/fetching-caching-and-revalidating#fetching-data-on-the-server-with-third-party-libraries
 */

export async function fetchElasticSearch(query, fetchOptions = {}) {
    const elasticSearchQuery = query;
    const shouldLookupLocationsWithinDrivingDistance = elasticSearchQuery.postcode && elasticSearchQuery.distance;

    if (shouldLookupLocationsWithinDrivingDistance) {
        elasticSearchQuery.withinDrivingDistance = await fetchLocationsWithinDrivingDistance(
            elasticSearchQuery.postcode,
            elasticSearchQuery.distance,
        );
    }
    const measureSearchDuration = elasticSearchDurationHistogram.startTimer();

    const body = elasticSearchRequestBody(elasticSearchQuery);
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(body),
        ...fetchOptions,
    });

    measureSearchDuration();

    incrementElasticSearchRequests(res.ok);

    return res;
}

export const fetchSimplifiedCachedElasticSearch = unstable_cache(
    async (query) => fetchSimplifiedElasticSearch(query),
    ["elastic-search-query"],
    {
        revalidate: 60,
    },
);

async function fetchSimplifiedElasticSearch(query) {
    const res = await fetchElasticSearch(query);

    if (!res.ok) {
        throw new Error(`Failed to fetch data: ${res.status}`);
    }

    const data = await res.json();

    return simplifySearchResponse(data);
}
