import { createQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { NextRequest, NextResponse } from "next/server";
import { fetchElasticSearch } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { parseSearchParams } from "@/app/stillinger/(sok)/_utils/parseSearchParams";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import { appLogger } from "@/app/_common/logging/appLogger";

export const dynamic = "force-dynamic";

/**
 * Note: This endpoint is used by pam-aduser
 */
export async function GET(request: NextRequest) {
    const migratedSearchParams = migrateSearchParams(request.nextUrl.searchParams);
    const searchParams = parseSearchParams(migratedSearchParams);
    const query = toApiQuery(createQuery(searchParams));

    try {
        const headers = await getDefaultHeaders();
        const { errors, response } = await fetchElasticSearch(
            query,
            headers,
            { signal: AbortSignal.timeout(55 * 1000) }, // fetchOptions
            false,
        );

        if (errors && errors.length > 0) {
            appLogger.error(`Det oppstod feil ved henting av stillinger:`, {
                component: "elasticsearch",
                errorCount: errors.length,
                esErrors: errors,
            });
            return new NextResponse(null, { status: 500 });
        }

        if (response && !response.ok) {
            appLogger.httpError("Kallet returnerte en feilkode, sender tilbake den samme feilkoden", {
                method: "POST",
                url: response.url,
                status: response.status,
                statusText: response.statusText,
            });

            return new NextResponse(null, { status: response.status });
        }

        const data = await response?.json();
        return Response.json(data);
    } catch (error) {
        if (error != null && typeof error === "object" && "name" in error && error.name === "TimeoutError") {
            appLogger.errorWithCause("Det tok for lang tid å vente på svar, avbryter:", error);
            return new NextResponse(null, { status: 408 });
        }
        appLogger.errorWithCause(`Uventet feil oppstod:'`, error);
        return new NextResponse(null, { status: 500 });
    }
}
