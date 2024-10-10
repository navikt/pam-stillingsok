import { createQuery, toApiQuery } from "@/app/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/(sok)/_utils/versioning/searchParamsVersioning";
import { NextResponse } from "next/server";
import logger from "@/app/_common/utils/logger";
import { fetchElasticSearch } from "@/app/(sok)/_utils/fetchElasticSearch";
import { parseSearchParams } from "@/app/(sok)/_utils/parseSearchParams";

export const dynamic = "force-dynamic";

/**
 * Note: This endpoint is used by pam-aduser
 */
export async function GET(request) {
    const migratedSearchParams = migrateSearchParams(request.nextUrl.searchParams);
    const searchParams = parseSearchParams(migratedSearchParams);
    const query = toApiQuery(createQuery(searchParams));

    try {
        const { errors, response } = await fetchElasticSearch(query, { signal: AbortSignal.timeout(55 * 1000) }, false);

        if (errors && errors.length > 0) {
            logger.error(`Det oppstod feil ved henting av stillinger: ${errors}`);
            return new NextResponse(null, { status: 500 });
        }

        if (!response.ok) {
            logger.error(`Kallet returnerte en feilkode, sender tilbake den samme feilkoden: ${response.status}`);
            return new NextResponse(null, { status: response.status });
        }

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        if (error.name === "TimeoutError") {
            logger.error("Det tok for lang tid å vente på svar, avbryter:", error);
            return new NextResponse(null, { status: 408 });
        }
        logger.error(`Uventet feil oppstod:'`, error);
        return new NextResponse(null, { status: 500 });
    }
}
