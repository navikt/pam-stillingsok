"use server";

import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import logger from "@/app/_common/utils/logger";
import { FETCH_SEARCH_WITHIN_DISTANCE_ERROR, FetchResult } from "./fetchTypes";

export interface Locations {
    postcodes: string[];
    municipals: string[];
    counties: string[];
}

interface AvstandApiDto {
    postnummer: string[];
    kommuner: string[];
    fylker: string[];
}

export async function fetchLocationsWithinDrivingDistance(
    referencePostCode: string,
    distance: number,
): Promise<FetchResult<Locations>> {
    const res = await fetch(
        `${process.env.PAM_GEOGRAFI_API_URL}/innen-avstand/${referencePostCode}?avstand=${distance}`,
        {
            headers: getDefaultHeaders(),
        },
    );

    if (!res.ok) {
        logger.error(`Failed to fetch within distance data: ${res.status} ${res.statusText}`);
        return {
            errors: [{ type: FETCH_SEARCH_WITHIN_DISTANCE_ERROR }],
        };
    }

    const data: AvstandApiDto = await res.json();
    const locations = {
        postcodes: data.postnummer,
        municipals: data.kommuner,
        counties: data.fylker,
    };

    return { data: locations };
}
