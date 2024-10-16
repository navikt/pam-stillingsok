"use server";

import loggerWithoutCallId from "@/app/_common/utils/loggerWithoutCallId";
import { QueryNames } from "@/app/(sok)/_utils/QueryNames";

export async function logSearch(rating, rawSearchParams) {
    const searchParams = removeUnknownSearchParams(rawSearchParams);
    const metadata = { params: searchParams, rating: rating };

    loggerWithoutCallId.info(`[rating search params] ${JSON.stringify(metadata)}`);
}

export async function logSearchString(searchString) {
    loggerWithoutCallId.info(`[search string] ${searchString}`);
}

export async function logOccupation(occupation) {
    loggerWithoutCallId.info(`[search occupation] ${occupation}`);
}

export async function logTextSearch(rawSearchParams) {
    const searchParams = removeUnknownSearchParams(rawSearchParams);

    if ("q" in searchParams && searchParams.q.length > 0) {
        const metadata = { params: searchParams };
        loggerWithoutCallId.info(`[search params] ${JSON.stringify(metadata)}`);
    }
}

function removeUnknownSearchParams(searchParams) {
    // We should not track unknown search parameters that user may have in url
    const withKnownQueryParamsOnly = { ...searchParams };
    Object.keys(withKnownQueryParamsOnly).forEach((key) => {
        if (!Object.values(QueryNames).includes(key)) {
            delete withKnownQueryParamsOnly[key];
        }
    });
    return withKnownQueryParamsOnly;
}
