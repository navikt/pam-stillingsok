"use server";

import loggerWithoutCallId from "@/app/_common/utils/loggerWithoutCallId";
import { createQuery, toBrowserQuery } from "@/app/(sok)/_utils/query";

export async function logSearch(rating, rawSearchParams) {
    const searchParams = toQueryParams(rawSearchParams);
    const metadata = { params: searchParams, rating: rating };

    loggerWithoutCallId.info(`[rating search params] ${JSON.stringify(metadata)}`);
}

export async function logTextSearch(rawSearchParams) {
    const searchParams = toQueryParams(rawSearchParams);

    if ("q" in searchParams && searchParams.q.length > 0) {
        const metadata = { params: searchParams };
        loggerWithoutCallId.info(`[search params] ${JSON.stringify(metadata)}`);
    }
}

function toQueryParams(searchParams) {
    return toBrowserQuery(createQuery(searchParams));
}
