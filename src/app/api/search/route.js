import elasticSearchRequestBody from "@/app/(sok)/_utils/elasticSearchRequestBody";
import { createQuery, toApiQuery } from "@/app/(sok)/_utils/query";
import { getDefaultHeaders } from "@/app/_common/utils/fetch";

export const dynamic = "force-dynamic";

/**
 * Note: This endpoint is used by pam-aduser
 */
export async function GET(request) {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = createQuery(searchParams);
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
