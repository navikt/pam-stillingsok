"use server";

import loggerWithoutCallId from "@/app/_common/utils/loggerWithoutCallId";
import { createQuery, toBrowserQuery } from "@/app/(sok)/_utils/query";

export async function logSearch(rating, rawSearchParams) {
    const searchParams = toQueryParams(rawSearchParams);

    loggerWithoutCallId.info("[rating search params]", { params: searchParams, rating: rating });
}

export async function logTextSearch(rawSearchParams) {
    const searchParams = toQueryParams(rawSearchParams);

    if ("q" in searchParams && searchParams.q.length > 0) {
        loggerWithoutCallId.info("[search params]", { params: searchParams });
    }
}

function toQueryParams(searchParams) {
    return toBrowserQuery(createQuery(searchParams));
}
