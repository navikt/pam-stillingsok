export const SortByEnumValues = {
    FAVOURITE_DATE: "favourite_date",
    PUBLISHED: "published",
    EXPIRES: "expires",
} as const;

export type SortByEnum = (typeof SortByEnumValues)[keyof typeof SortByEnumValues];

export function isValidSortBy(value: string | undefined): value is keyof typeof SortByEnumValues {
    if (value == null) {
        return false;
    }
    return Object.keys(SortByEnumValues).includes(value);
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
