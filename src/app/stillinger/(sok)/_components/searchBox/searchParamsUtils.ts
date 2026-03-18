import { AllowedSavedSearchParams, QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { UrlSearchParams } from "@/types/routing";

export function toUrlSearchParams(searchParams: UrlSearchParams): URLSearchParams {
    const urlSearchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(searchParams)) {
        if (typeof value === "string") {
            urlSearchParams.append(key, value);
        } else if (Array.isArray(value)) {
            for (const entry of value) {
                urlSearchParams.append(key, entry);
            }
        }
    }

    return urlSearchParams;
}

function filterAllowedSavedSearchParams(searchParams: URLSearchParams): URLSearchParams {
    const filteredSearchParams = new URLSearchParams();

    searchParams.forEach((value, key) => {
        if (AllowedSavedSearchParams.has(key)) {
            filteredSearchParams.append(key, value);
        }
    });

    return filteredSearchParams;
}

export function toSavedSearchUrlSearchParams(searchParams: UrlSearchParams): URLSearchParams {
    return filterAllowedSavedSearchParams(toUrlSearchParams(searchParams));
}

export function createSavedSearchUrlSearchParams(searchParams: URLSearchParams): URLSearchParams {
    return filterAllowedSavedSearchParams(searchParams);
}

export function cloneUrlSearchParams(searchParams: URLSearchParams): URLSearchParams {
    return new URLSearchParams(searchParams.toString());
}

export function searchParamsSize(searchParams: URLSearchParams): number {
    let count = 0;

    searchParams.forEach(() => {
        count += 1;
    });

    return count;
}

export function createSavedSearchParamsWithoutVersion(searchParams: URLSearchParams): URLSearchParams {
    const nextSearchParams = cloneUrlSearchParams(searchParams);

    nextSearchParams.delete(QueryNames.URL_VERSION);

    return nextSearchParams;
}
