import { createQuery, toApiQuery } from "@/app/stillinger/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { NextRequest, NextResponse } from "next/server";
import logger from "@/app/stillinger/_common/utils/logger";
import { fetchElasticSearch } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { parseSearchParams } from "@/app/stillinger/(sok)/_utils/parseSearchParams";
import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

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
            logger.error(`Det oppstod feil ved henting av stillinger: ${errors}`);
            return new NextResponse(null, { status: 500 });
        }

        if (response && !response.ok) {
            logger.error(`Kallet returnerte en feilkode, sender tilbake den samme feilkoden: ${response.status}`);
            return new NextResponse(null, { status: response.status });
        }

        const data = await response?.json();
        return Response.json(data);
    } catch (error) {
        if (error != null && typeof error === "object" && "name" in error && error.name === "TimeoutError") {
            logger.error("Det tok for lang tid å vente på svar, avbryter:", error);
            return new NextResponse(null, { status: 408 });
        }
        logger.error(`Uventet feil oppstod:'`, error);
        return new NextResponse(null, { status: 500 });
    }
}
