"use server";

import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { unstable_cache } from "next/cache";
import { FETCH_POSTCODES_ERROR, FetchResult } from "./fetchTypes";
import { logger } from "@sentry/utils";

export interface Postcode {
    postcode: string;
    city: string;
}

interface PostdataDto {
    postkode: string;
    by: string;
    // kommune: KommuneDTO
    // fylke: FylkeDTO
}

async function fetchPostcodes(): Promise<FetchResult<Postcode[]>> {
    const res = await fetch(`${process.env.PAM_GEOGRAFI_API_URL}/postdata?sort=asc`, {
        headers: getDefaultHeaders(),
    });

    if (!res.ok) {
        logger.error(`Failed to fetch postcode data: ${res.status} ${res.statusText}`);
        return {
            errors: [{ type: FETCH_POSTCODES_ERROR }],
            data: [],
        };
    }

    const data: PostdataDto[] = await res.json();
    const postcodes = data.map((postdata) => ({
        postcode: postdata.postkode,
        city: postdata.by,
    }));

    return {
        data: postcodes,
    };
}

export const fetchCachedPostcodes = unstable_cache(async () => fetchPostcodes(), ["postcodes-query"], {
    revalidate: 3600,
});
