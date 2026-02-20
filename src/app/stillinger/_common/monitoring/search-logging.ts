"use server";

import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { appLogger } from "@/app/_common/logging/appLogger";

export async function logSearch(rating: string, rawSearchParams: Record<string, string | string[]>) {
    const searchParams = removeUnknownSearchParams(rawSearchParams);
    const metadata = { params: searchParams, rating: rating };

    appLogger.info("[rating search params]", metadata);
}

export async function logTextSearch(rawSearchParams: Record<string, string | string[] | undefined>) {
    const searchParams = removeUnknownSearchParams(rawSearchParams);

    if ("q" in searchParams && typeof searchParams.q === "string" && searchParams.q.length > 0) {
        const metadata = { params: searchParams };
        appLogger.info("[search params]", metadata);
    }
}

function removeUnknownSearchParams(searchParams: Record<string, string | string[] | undefined>) {
    // We should not track unknown search parameters that user may have in url
    const knownParams: Record<string, string | string[] | undefined> = {};

    Object.keys(searchParams).forEach((key) => {
        if (Object.values(QueryNames).includes(key)) {
            knownParams[key] = searchParams[key];
        }
    });
    return knownParams;
}
