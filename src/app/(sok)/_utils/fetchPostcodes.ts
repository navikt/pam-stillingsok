"use server";

import { getDefaultHeaders } from "@/app/_common/utils/fetch";
import { revalidateTag, unstable_cache } from "next/cache";
import logger from "@/app/_common/utils/logger";
import { FETCH_POSTCODES_ERROR, FetchResult } from "./fetchTypes";

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

const CACHE_KEY = "postcodes-query";

const fetchCachedPostcodesInternal = unstable_cache(async () => fetchPostcodes(), [CACHE_KEY], {
    revalidate: 3600,
});

export async function fetchCachedPostcodes(): Promise<FetchResult<Postcode[]>> {
    const result = await fetchCachedPostcodesInternal();

    if (result.errors && result.errors.length > 0) {
        logger.warn("Errors when fetching postcodes, manually purging cache");
        revalidateTag(CACHE_KEY);
    }

    return result;
}
