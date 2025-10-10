export const FilterByEnumValues = {
    UNEXPIRED: "unexpired",
    EXPIRED: "expired",
} as const;

export type FilterKey = keyof typeof FilterByEnumValues;
export type FilterValue = (typeof FilterByEnumValues)[FilterKey];

const FilterKeyByValue: Readonly<Record<FilterValue, FilterKey>> = {
    unexpired: "UNEXPIRED",
    expired: "EXPIRED",
} as const;

export const isFilterKey = (v: unknown): v is FilterKey => typeof v === "string" && v in FilterByEnumValues;

export const isFilterValue = (v: unknown): v is FilterValue => typeof v === "string" && v in FilterKeyByValue;

export function normalizeFilter(input: string | undefined): FilterValue | undefined {
    if (!input) return undefined;
    if (isFilterValue(input)) return input; // value i URL
    if (isFilterKey(input)) return FilterByEnumValues[input]; // støtt KEY også
    return undefined;
}

export const SortByEnumValues = {
    FAVOURITE_DATE: "favourite_date",
    PUBLISHED: "published",
    EXPIRES: "expires",
} as const;

export type SortKey = keyof typeof SortByEnumValues;
export type SortValue = (typeof SortByEnumValues)[SortKey];

const SortKeyByValue: Readonly<Record<SortValue, SortKey>> = {
    favourite_date: "FAVOURITE_DATE",
    published: "PUBLISHED",
    expires: "EXPIRES",
} as const;

export const isSortKey = (v: unknown): v is SortKey => typeof v === "string" && v in SortByEnumValues;

export const isSortValue = (v: unknown): v is SortValue => typeof v === "string" && v in SortKeyByValue;

export function normalizeSort(input: string | undefined): SortValue | undefined {
    if (!input) return undefined;
    if (isSortValue(input)) return input; // value i URL
    if (isSortKey(input)) return SortByEnumValues[input]; // støtt KEY også
    return undefined;
}

export const isValidUrl = (url: string): boolean => {
    // Hvis URL-en starter med "http" eller "https", parse den direkte
    const urlWithProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;

    try {
        // Dersom url har en protokoll som ikke er http eller https
        // vil den nå ha to protokoller og new URL vil feile
        const parsedUrl = new URL(urlWithProtocol);

        // Sjekk at protokollen kun er http eller https
        const isHttpProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        const hasValidHostname = parsedUrl.hostname.includes(".") || parsedUrl.hostname === "localhost";

        // Definer farlige mønstre som vi ønsker å unngå, inkludert enkodede tegn
        const dangerousPattern = /[<>{};]/;
        const encodedPattern = /(%3C|%3E|%7B|%7D|%3B)/i;

        // Dekod pathname og search før validering
        const decodedPathname = decodeURIComponent(parsedUrl.pathname);
        const decodedSearch = decodeURIComponent(parsedUrl.search);

        // Sjekk både decoded og encoded form for farlige tegn
        const isSafePathname = !dangerousPattern.test(decodedPathname) && !encodedPattern.test(parsedUrl.pathname);
        const isSafeSearch = !dangerousPattern.test(decodedSearch) && !encodedPattern.test(parsedUrl.search);

        return isHttpProtocol && hasValidHostname && isSafePathname && isSafeSearch;
    } catch {
        return false;
    }
};
