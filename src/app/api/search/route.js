import { createQuery, toApiQuery } from "@/app/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/(sok)/_utils/searchParamsVersioning";
import { NextResponse } from "next/server";
import logger from "@/app/_common/utils/logger";
import { fetchElasticSearch } from "@/app/(sok)/_utils/fetchElasticSearch";

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
    const query = toApiQuery(createQuery(migratedSearchParams || searchParams));

    try {
        const { errors, response } = await fetchElasticSearch(query, { signal: AbortSignal.timeout(55 * 1000) }, false);

        if (errors) {
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
