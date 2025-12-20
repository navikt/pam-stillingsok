"use server";

import { getDefaultHeaders } from "@/app/(nonce)/stillinger/_common/utils/fetch";
import { unstable_cache } from "next/cache";
import logger from "@/app/(nonce)/stillinger/_common/utils/logger";
import { FETCH_POSTCODES_ERROR, FetchResult } from "./fetchTypes";

export interface Postcode {
    postcode: string;
    city: string;
}

interface PostdataDto {
    postkode: string;
    by: string;
}

async function fetchPostcodes(headers: HeadersInit): Promise<FetchResult<Postcode[]>> {
    const res = await fetch(`${process.env.PAM_GEOGRAFI_API_URL}/postdata?sort=asc`, {
        headers,
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

const fetchCachedPostcodesInternal = unstable_cache(
    async (headers: HeadersInit) => fetchPostcodes(headers),
    [CACHE_KEY],
    {
        revalidate: 3600,
        // Hvis vi senere vil bruke revalidateTag, må følgende legges til:
        // tags: [CACHE_KEY],
        // men selve revalidateTag-kallet må da bo i en server action / route handler,
        // ikke i denne render-pathen.
    },
);

export async function fetchCachedPostcodes(): Promise<FetchResult<Postcode[]>> {
    const headers = await getDefaultHeaders();
    headers.set("Nav-CallId", "");
    const result = await fetchCachedPostcodesInternal(headers);

    if (result.errors && result.errors.length > 0) {
        logger.warn("Errors when fetching postcodes, manually purging cache");
    }

    return result;
}
