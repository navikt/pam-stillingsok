import "server-only";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";
import type { SearchApiParams } from "@/app/stillinger/(sok)/_utils/searchApiParams";

const DEFAULT_TIMEOUT_MS = 5000;

export function isSearchApiV2Enabled(): boolean {
    return process.env.SEARCH_API_V2_ENABLED === "true";
}

export async function fetchFromSearchApi(path: string, fetchOptions: RequestInit = {}): Promise<Response> {
    const headers = await getDefaultHeaders();

    return fetch(`${process.env.PAMSEARCHAPI_URL}${path}`, {
        headers,
        ...fetchOptions,
        signal: fetchOptions.signal ?? AbortSignal.timeout(DEFAULT_TIMEOUT_MS),
    });
}

export async function postToSearchApi(body: unknown, fetchOptions: RequestInit = {}): Promise<Response> {
    return fetchFromSearchApi("/api/ad/_search", {
        method: "POST",
        body: JSON.stringify(body),
        ...fetchOptions,
    });
}

export async function postToSearchApiV2(
    params: SearchApiParams,
    legacyBody: unknown,
    fetchOptions: RequestInit = {},
): Promise<Response> {
    return fetchFromSearchApi("/api/ad/_search/v2", {
        method: "POST",
        body: JSON.stringify({ params, legacyBody }),
        ...fetchOptions,
    });
}
