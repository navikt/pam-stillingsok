"use server";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import logger from "@/app/stillinger/_common/utils/logger";
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

// Only allow Norwegian postcodes, usually 4 digits
function isValidPostCode(postCode: string | undefined): boolean {
    // Adjust pattern as needed
    return typeof postCode === "string" && /^[0-9]{4,5}$/.test(postCode);
}

export async function fetchLocationsWithinDrivingDistance(
    referencePostCode?: string,
    distance?: string,
): Promise<FetchResult<Locations>> {
    if (!isValidPostCode(referencePostCode)) {
        logger.error(`Invalid referencePostCode passed to fetchLocationsWithinDrivingDistance: ${referencePostCode}`);
        return {
            errors: [{ type: FETCH_SEARCH_WITHIN_DISTANCE_ERROR }],
        };
    }
    const headers = await getDefaultHeaders();
    headers.set("Nav-CallId", "");
    const res = await fetch(
        `${process.env.PAM_GEOGRAFI_API_URL}/innen-avstand/${referencePostCode}?avstand=${distance}`,
        {
            headers: headers,
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
