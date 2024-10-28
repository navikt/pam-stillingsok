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

        // Validerer protokoll og hostname
        const isHttpProtocol = parsedUrl.protocol === "http:" || parsedUrl.protocol === "https:";
        const hasValidDomainFormat = /^[a-zA-Z\d.-]+$/.test(parsedUrl.hostname);

        // Returnerer true kun hvis begge sjekkene er sanne
        return isHttpProtocol && hasValidDomainFormat && parsedUrl.hostname.includes(".");
    } catch (e) {
        return false;
    }
};
