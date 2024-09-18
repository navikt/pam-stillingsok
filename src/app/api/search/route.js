import { createQuery, toApiQuery } from "@/app/(sok)/_utils/query";
import { migrateSearchParams } from "@/app/(sok)/_utils/searchParamsVersioning";
import { NextResponse } from "next/server";
import logger from "@/app/_common/utils/logger";
import { fetchElasticSearch } from "@/app/(sok)/_utils/fetchElstaicSearch";

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
        const res = await fetchElasticSearch(query, { signal: AbortSignal.timeout(55 * 1000) });

        if (!res.ok) {
            const msg = `Kallet returnerte en feilkode, sender tilbake den samme feilkoden: ${res.status}`;
            logger.warn(msg);
            return new NextResponse(null, { status: res.status });
        }

        const data = await res.json();
        return Response.json(data);
    } catch (error) {
        if (error.name === "TimeoutError") {
            logger.warn("Det tok for lang tid å vente på svar, avbryter:", error);
            return new NextResponse(null, { status: 408 });
        }
        logger.error(`Uventet feil oppstod:'`, error);
        return new NextResponse(null, { status: 500 });
    }
}
