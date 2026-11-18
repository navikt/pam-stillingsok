import { z } from "zod";

export const FAVOURITE_FILTER_PARAM = "filter";
export const FAVOURITE_SORT_PARAM = "sort";

export const FilterByEnumValues = {
    UNEXPIRED: "unexpired",
    EXPIRED: "expired",
} as const;

export const SortByEnumValues = {
    FAVOURITE_DATE: "favourite_date",
    PUBLISHED: "published",
    EXPIRES: "expires",
} as const;

const filterSchema = z.enum([FilterByEnumValues.UNEXPIRED, FilterByEnumValues.EXPIRED]);
const sortSchema = z.enum([SortByEnumValues.FAVOURITE_DATE, SortByEnumValues.PUBLISHED, SortByEnumValues.EXPIRES]);

export type FilterValue = z.infer<typeof filterSchema>;
export type SortValue = z.infer<typeof sortSchema>;
export type FavouriteSearchParams = Partial<Record<string, string | string[]>>;

export const DEFAULT_FAVOURITE_FILTER = FilterByEnumValues.UNEXPIRED;
export const DEFAULT_FAVOURITE_SORT = SortByEnumValues.FAVOURITE_DATE;

function firstValue(raw: string | string[] | undefined): string | undefined {
    const value = Array.isArray(raw) ? raw[0] : raw;
    return value && value === value.toUpperCase() ? value.toLowerCase() : value;
}

export function readFavouritePreferences(searchParams: FavouriteSearchParams) {
    const filter = filterSchema.safeParse(firstValue(searchParams[FAVOURITE_FILTER_PARAM]));
    const sort = sortSchema.safeParse(firstValue(searchParams[FAVOURITE_SORT_PARAM]));

    return {
        filterPreference: filter.success ? filter.data : DEFAULT_FAVOURITE_FILTER,
        sortPreference: sort.success ? sort.data : DEFAULT_FAVOURITE_SORT,
    };
}
