import "server-only";

import { getDefaultHeaders } from "@/app/stillinger/_common/utils/fetch";

const DEFAULT_TIMEOUT_MS = 5000;

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
