import { normalizeFilter, FilterValue } from "@/app/stillinger/_common/utils/utilsts";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { FilterByEnumValues } from "@/app/stillinger/_common/utils/filter-constants";

type RawParam = string | string[] | undefined;
const extractFirst = (raw: RawParam): string | undefined => (Array.isArray(raw) ? raw[0] : raw);

type GetFilterPreferenceInput = {
    searchParams: Readonly<Record<string, RawParam>> | URLSearchParams;
    defaultFilter?: FilterValue;
    paramKey?: string; // default "filterBy"
};

export function getFilterPreference({
    searchParams,
    defaultFilter = FilterByEnumValues.UNEXPIRED,
    paramKey = QueryNames.FILTER,
}: GetFilterPreferenceInput): FilterValue {
    const raw =
        searchParams instanceof URLSearchParams
            ? (searchParams.get(paramKey) ?? undefined)
            : extractFirst(searchParams[paramKey]);

    const filter = normalizeFilter(raw);
    return filter ?? defaultFilter;
}
