import "server-only";
import { z } from "zod";
import { mapGeografiTilLocations } from "@/app/_common/geografi/locationsMapping";
import type { FylkeRaw, KommuneRaw, SearchLocation } from "@/app/_common/geografi/locationsMapping";
import { appLogger } from "@/app/_common/logging/appLogger";

export const FETCH_KOMMUNER_ERROR = "FETCH_KOMMUNER_ERROR" as const;
export const FETCH_FYLKER_ERROR = "FETCH_FYLKER_ERROR" as const;
export const FETCH_PARSE_ERROR = "FETCH_PARSE_ERROR" as const;

export const FETCH_NETWORK_ERROR = "FETCH_NETWORK_ERROR" as const;
export const FETCH_CONFIG_ERROR = "FETCH_CONFIG_ERROR" as const;

export type FetchError =
    | { readonly type: typeof FETCH_KOMMUNER_ERROR; readonly status: number; readonly statusText: string }
    | { readonly type: typeof FETCH_FYLKER_ERROR; readonly status: number; readonly statusText: string }
    | { readonly type: typeof FETCH_PARSE_ERROR; readonly endpoint: "kommuner" | "fylker" }
    | { readonly type: typeof FETCH_NETWORK_ERROR; readonly endpoint: "kommuner" | "fylker" }
    | { readonly type: typeof FETCH_CONFIG_ERROR; readonly envVarName: "PAM_GEOGRAFI_API_URL" };

export type FetchResult<TData> = {
    readonly data: TData;
    readonly errors: readonly FetchError[];
};

const kommuneRawSchema = z.object({
    navn: z.string(),
    fylkesnummer: z.string(),
    kommunenummer: z.string(),
});

const fylkeRawSchema = z.object({
    navn: z.string(),
    fylkesnummer: z.string(),
});

const parseJsonArray = async <T>(response: Response, schema: z.ZodType<T>): Promise<T | null> => {
    const json: unknown = await response.json();
    const parsed = schema.safeParse(json);

    if (!parsed.success) {
        return null;
    }

    return parsed.data;
};

const REVALIDATE_SECONDS = 60 * 60 * 24 * 7; // 7 dager
const TAG_GEOGRAFI = "geografi" as const;

export async function fetchLocations(): Promise<FetchResult<SearchLocation[]>> {
    const baseUrl = process.env.PAM_GEOGRAFI_API_URL;

    // Endepunktet krever at Nav-CallId finnes i header, kan være blank
    const headers = new Headers();
    headers.set("Nav-CallId", "");

    if (!baseUrl || baseUrl.trim().length === 0) {
        appLogger.error("Mangler PAM_GEOGRAFI_API_URL");
        return {
            data: [],
            errors: [{ type: FETCH_CONFIG_ERROR, envVarName: "PAM_GEOGRAFI_API_URL" }],
        };
    }

    const results = await Promise.allSettled([
        fetch(`${baseUrl}/kommuner`, {
            next: { revalidate: REVALIDATE_SECONDS, tags: [TAG_GEOGRAFI, "geografi:kommuner"] },
            headers,
        }),
        fetch(`${baseUrl}/fylker`, {
            next: { revalidate: REVALIDATE_SECONDS, tags: [TAG_GEOGRAFI, "geografi:fylker"] },
            headers,
        }),
    ]);

    const [kommunerResult, fylkerResult] = results;

    const errors: FetchError[] = [];

    const kommunerResponse = kommunerResult.status === "fulfilled" ? kommunerResult.value : null;
    if (!kommunerResponse) {
        appLogger.error("Feilet å hente kommuner (nettverksfeil)");
        errors.push({ type: FETCH_NETWORK_ERROR, endpoint: "kommuner" });
    }

    const fylkerResponse = fylkerResult.status === "fulfilled" ? fylkerResult.value : null;
    if (!fylkerResponse) {
        appLogger.error("Feilet å hente fylker (nettverksfeil)");
        errors.push({ type: FETCH_NETWORK_ERROR, endpoint: "fylker" });
    }

    if (!kommunerResponse || !fylkerResponse) {
        return { data: [], errors };
    }

    if (!kommunerResponse.ok) {
        appLogger.httpError("Feilet å hente kommuner", {
            method: "GET",
            url: kommunerResponse.url,
            status: kommunerResponse.status,
            statusText: kommunerResponse.statusText,
        });
        errors.push({
            type: FETCH_KOMMUNER_ERROR,
            status: kommunerResponse.status,
            statusText: kommunerResponse.statusText,
        });
    }

    if (!fylkerResponse.ok) {
        appLogger.httpError(`Feilet å hente fylker`, {
            method: "GET",
            url: fylkerResponse.url,
            status: fylkerResponse.status,
            statusText: fylkerResponse.statusText,
        });
        errors.push({
            type: FETCH_FYLKER_ERROR,
            status: fylkerResponse.status,
            statusText: fylkerResponse.statusText,
        });
    }

    if (errors.length > 0) {
        return { data: [], errors };
    }

    const municipals = await parseJsonArray(kommunerResponse, z.array(kommuneRawSchema));
    if (!municipals) {
        return { data: [], errors: [{ type: FETCH_PARSE_ERROR, endpoint: "kommuner" }] };
    }

    const counties = await parseJsonArray(fylkerResponse, z.array(fylkeRawSchema));
    if (!counties) {
        return { data: [], errors: [{ type: FETCH_PARSE_ERROR, endpoint: "fylker" }] };
    }

    return {
        data: mapGeografiTilLocations({
            municipals: municipals satisfies KommuneRaw[],
            counties: counties satisfies FylkeRaw[],
        }),
        errors: [],
    };
}
