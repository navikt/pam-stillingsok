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

export const isValidUrl = (url: string): boolean => {
    const patternHttpUrl = new RegExp(
        "^(https?:\\/\\/)?" + // protocol
            "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
            "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
            "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
            "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
            "(\\#[-a-z\\d_]*)?$", // fragment locator
        "i",
    );

    return patternHttpUrl.test(url);
};
