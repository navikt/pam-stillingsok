import { AllowedSavedSearchParams, QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { type UrlSearchParams } from "@/types/routing";
import { ReadonlyURLSearchParams } from "next/navigation";

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

export function toSavedSearchUrlSearchParams(searchParams: UrlSearchParams) {
    return filterAllowedSavedSearchParams(toUrlSearchParams(searchParams));
}

export function createSavedSearchUrlSearchParams(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
    return filterAllowedSavedSearchParams(searchParams);
}

export function searchParamsSize(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
    let count = 0;

    searchParams.forEach(() => {
        count += 1;
    });

    return count;
}

export function createSavedSearchParamsWithoutVersion(searchParams: URLSearchParams | ReadonlyURLSearchParams) {
    const nextSearchParams = createSavedSearchUrlSearchParams(searchParams);

    nextSearchParams.delete(QueryNames.URL_VERSION);

    return nextSearchParams;
}
