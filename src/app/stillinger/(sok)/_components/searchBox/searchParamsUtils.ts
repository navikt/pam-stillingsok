import type { ReadonlyURLSearchParams } from "next/navigation";
import { AllowedSavedSearchParams, QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import type { UrlSearchParams } from "@/types/routing";
import { isDrivingDistanceFilterActive } from "./drivingDistanceState";

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

export function getSavedSearchFilterKeys(searchParams: URLSearchParams | ReadonlyURLSearchParams): string[] {
    return [...new Set(createSavedSearchParamsWithoutVersion(searchParams).keys())].sort();
}

const DRIVING_DISTANCE_FILTER_KEYS = new Set<string>([QueryNames.POSTCODE, QueryNames.DISTANCE]);

const CHILD_FILTER_KEYS: Readonly<Record<string, readonly string[]>> = {
    [QueryNames.COUNTY]: [QueryNames.MUNICIPAL],
    [QueryNames.OCCUPATION_FIRST_LEVEL]: [QueryNames.OCCUPATION_SECOND_LEVEL],
};

function isActiveFilterValue(key: string, value: string) {
    if (value === "") {
        return false;
    }
    if (key === QueryNames.NEED_DRIVERS_LICENSE) {
        return true;
    }
    if (
        [
            QueryNames.INTERNATIONAL,
            QueryNames.IS_SUMMER_JOB,
            QueryNames.IS_XMAS_JOB,
            QueryNames.HAS_SUPERRASK_SOKNAD,
        ].some((booleanKey) => booleanKey === key)
    ) {
        return value === "true";
    }
    return value !== "false";
}

function hasActiveValue(searchParams: URLSearchParams, key: string): boolean {
    return searchParams.getAll(key).some((value) => isActiveFilterValue(key, value));
}

function isParentCoveredByChild(searchParams: URLSearchParams, key: string, value: string): boolean {
    if (key === QueryNames.INTERNATIONAL) {
        return hasActiveValue(searchParams, QueryNames.COUNTRY);
    }

    const childKeys = CHILD_FILTER_KEYS[key];
    if (!childKeys) {
        return false;
    }

    return childKeys.some((childKey) =>
        searchParams
            .getAll(childKey)
            .some((childValue) => isActiveFilterValue(childKey, childValue) && childValue.startsWith(`${value}.`)),
    );
}

export function countActiveFilters(searchParams: URLSearchParams, keys: readonly string[]) {
    const includesDrivingDistance = keys.some((key) => DRIVING_DISTANCE_FILTER_KEYS.has(key));

    const countedFilters = keys
        .filter((key) => !DRIVING_DISTANCE_FILTER_KEYS.has(key))
        .flatMap((key) =>
            searchParams
                .getAll(key)
                .filter((value) => isActiveFilterValue(key, value))
                .filter((value) => !isParentCoveredByChild(searchParams, key, value)),
        );

    const drivingDistanceCount = includesDrivingDistance && isDrivingDistanceFilterActive(searchParams) ? 1 : 0;

    return countedFilters.length + drivingDistanceCount;
}
