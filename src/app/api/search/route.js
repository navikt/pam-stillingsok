import elasticSearchRequestBody from "@/app/(sok)/_utils/elasticSearchRequestBody";
import { createQuery, toApiQuery } from "@/app/(sok)/_utils/query";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { migrateSearchParams } from "@/app/(sok)/_utils/searchParamsVersioning";

export const dynamic = "force-dynamic";

function parseSearchParams(entries) {
    const searchParams = {};

    entries.forEach((value, key) => {
        if (searchParams[key]) {
            if (Array.isArray(searchParams[key])) {
                searchParams[key] = [...searchParams[key], value];
            } else {
                searchParams[key] = [searchParams[key], value];
            }
        } else {
            searchParams[key] = value;
        }
    });
    return searchParams;
}

/**
 * Note: This endpoint is used by pam-aduser
 */
export async function GET(request) {
    const searchParams = parseSearchParams(request.nextUrl.searchParams);
    const migratedSearchParams = migrateSearchParams(searchParams);
    const query = createQuery(migratedSearchParams || searchParams);
    const body = elasticSearchRequestBody(toApiQuery(query));
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: getDefaultHeaders(),
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        Response.error();
    }

    const data = await res.json();
    return Response.json(data);
}
