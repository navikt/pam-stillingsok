import elasticSearchRequestBody from "@/app/(sok)/_utils/elasticSearchRequestBody";
import simplifySearchResponse from "@/app/(sok)/_utils/simplifySearchResponse";
import { createQuery, toApiQuery } from "@/app/(sok)/_utils/query";

// Todo - test at denne fungere med aduser. Jeg tror aduser kaller dette endepunktet når email for lagrede søk skal sendes ut

/**
 * Note: This endpoint is used by pam-aduser
 */
export async function GET(request) {
    const searchParams = Object.fromEntries(request.nextUrl.searchParams);
    const query = createQuery(searchParams);
    const body = elasticSearchRequestBody(toApiQuery(query));
    const res = await fetch(`${process.env.PAMSEARCHAPI_URL}/stillingsok/ad/_search`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        Response.error();
    }

    let data = await res.json();
    data = simplifySearchResponse(data);

    return Response.json(data);
}
