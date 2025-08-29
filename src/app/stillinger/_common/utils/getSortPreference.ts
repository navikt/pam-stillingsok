import { normalizeSort, SortValue } from "@/app/stillinger/_common/utils/utilsts";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";

type RawParam = string | string[] | undefined;
const extractFirst = (raw: RawParam): string | undefined => (Array.isArray(raw) ? raw[0] : raw);

type GetSortPreferenceInput = {
    searchParams: Readonly<Record<string, RawParam>> | URLSearchParams;
    defaultSort?: SortValue;
    paramKey?: string; // default "sortBy"
};

export function getSortPreference({
    searchParams,
    defaultSort = "favourite_date",
    paramKey = QueryNames.SORT,
}: GetSortPreferenceInput): SortValue {
    const raw =
        searchParams instanceof URLSearchParams
            ? (searchParams.get(paramKey) ?? undefined)
            : extractFirst(searchParams[paramKey]);

    const sort = normalizeSort(raw);
    return sort ?? defaultSort;
}
