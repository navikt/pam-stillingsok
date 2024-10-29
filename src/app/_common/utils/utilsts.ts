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
    const urlWithProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;
    const parsedUrl = new URL(urlWithProtocol);

    const isHttpProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
    const hasValidHostname = parsedUrl.hostname.includes(".") || parsedUrl.hostname === "localhost";

    // Kast feil hvis protokollen er farlig
    if (/^(javascript|data|vbscript):/i.test(parsedUrl.protocol)) {
        throw new Error(`Ugyldig URL: Farlig protokoll oppdaget (${parsedUrl.protocol})`);
    }

    return isHttpProtocol && hasValidHostname;
};
