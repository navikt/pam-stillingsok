export const SortByEnumValues = {
    FAVOURITE_DATE: "favourite_date",
    PUBLISHED: "published",
    EXPIRES: "expires",
} as const;

export type SortByEnum = (typeof SortByEnumValues)[keyof typeof SortByEnumValues];

// eslint-disable-next-line  @typescript-eslint/no-explicit-any
export function isValidSortBy(value: any): value is keyof typeof SortByEnumValues {
    return Object.keys(SortByEnumValues).includes(value);
}
