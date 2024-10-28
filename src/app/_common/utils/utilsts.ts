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
    try {
        // Legger til https:// hvis ingen protokoll er tilstede
        const urlWithProtocol = /^https?:\/\//.test(url) ? url : `https://${url}`;

        const parsedUrl = new URL(urlWithProtocol);
        const isHttpProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        const hasValidHostname = parsedUrl.hostname.includes(".") || parsedUrl.hostname === "localhost";

        // Sjekker at protokollen er http eller https
        return isHttpProtocol && hasValidHostname;
    } catch (e) {
        return false;
    }
};
