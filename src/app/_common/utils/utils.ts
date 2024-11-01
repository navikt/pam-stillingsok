const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;
const months = [
    "januar",
    "februar",
    "mars",
    "april",
    "mai",
    "juni",
    "juli",
    "august",
    "september",
    "oktober",
    "november",
    "desember",
];
const patternHttpUrl = new RegExp(
    "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // domain name
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // port and path
        "(\\?[;&a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$", // fragment locator
    "i",
);

export function isValidISOString(isoString: string | undefined) {
    if (isoString == null) {
        return false;
    }
    return ISO_8601_DATE.test(isoString);
}

export function formatDate(input: Date | string | undefined) {
    if (!input) return undefined;

    let date: Date;

    if (input instanceof Date) {
        date = input;
    } else if (isValidISOString(input)) {
        date = new Date(input);
    } else {
        return String(input); // Returner input som streng hvis det ikke er en gyldig ISO-streng eller Date
    }

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${day}. ${month} ${year}`;
}

export function formatNumber(number: number) {
    try {
        return number.toLocaleString("no");
    } catch (err) {
        return number;
    }
}

export function userAgentIsInternetExplorer() {
    if (typeof window === "undefined") {
        // You're on server
        return false;
    }
    const { userAgent } = window.navigator;
    return userAgent.indexOf("MSIE ") >= 0 || userAgent.indexOf("Trident/") >= 0;
}

export function isStringEmpty(value: string | undefined) {
    return value === undefined || value === null || value.trim().length === 0;
}

export function isValidUrl(input: string) {
    if (userAgentIsInternetExplorer()) {
        // 'new URL(..)' is unsupported in IE
        return patternHttpUrl.test(input);
    }

    try {
        return new URL(input).protocol.startsWith("http");
    } catch (e) {
        return false;
    }
}

export function isValidTelephone(input: string) {
    const formatted = input.trim().replaceAll(/[() .,-]/g, "");
    const pattern = /^\+?[0-9]{0,20}$/;
    return pattern.test(formatted);
}

export function isValidEmail(input: string) {
    // Regex from https://emailregex.com
    const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return pattern.test(input);
}

export function containsEmail(input: string) {
    // Regex from https://emailregex.com
    try {
        const preprocessedInput = input.replace(/&#64;/, "@");
        const pattern =
            /(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/;

        return pattern.test(preprocessedInput);
    } catch (e) {
        return input;
    }
}

export function extractEmail(input: string) {
    // Regex from https://emailregex.com
    const preprocessedInput = input.replace(/&#64;/g, "@");
    const pattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    return preprocessedInput.match(pattern) ?? [];
}

export function mailtoInString(input: string, email: string) {
    const pattern = new RegExp(`mailto:${email}`, "g");

    return pattern.test(input);
}

export const mediumDisplayName = (medium: string) => {
    if (medium === "EURES") return "NKSE";
    return medium;
};

export const ExtentEnum = {
    HELTID: "Heltid",
    DELTID: "Deltid",
    HELTID_OG_DELTID: "Heltid_og_Deltid",
    UKJENT: "Ukjent",
};

export const SortByEnum = Object.freeze({
    FAVOURITE_DATE: "favourite_date",
    PUBLISHED: "published",
    EXPIRES: "expires",

    validate(value: string): value is SortByEnumValues {
        return Object.values(SortByEnumValues).includes(value as SortByEnumValues);
    },
});

// Alternativt, for å få tilgang til typene automatisk:
export const SortByEnumValues = {
    FAVOURITE_DATE: "favourite_date",
    PUBLISHED: "published",
    EXPIRES: "expires",
} as const;

type SortByEnumValues = (typeof SortByEnumValues)[keyof typeof SortByEnumValues];
