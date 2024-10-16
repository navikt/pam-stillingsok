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

export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function formatDate(input) {
    try {
        let isoString;

        // Hvis input er et Date-objekt, konverter det til ISO-streng
        if (input instanceof Date) {
            isoString = input.toISOString();
        } else if (typeof input === "string" && isValidISOString(input)) {
            isoString = input;
        } else {
            return input; // Returner input uendret hvis det ikke er en gyldig ISO-streng eller Date
        }

        const dt = isoString.split("-");
        const day = parseInt(dt[2].split("T")[0], 10);
        const month = months[parseInt(dt[1], 10) - 1];
        return `${day}. ${month} ${dt[0]}`;
    } catch (error) {
        return String(input); // Returner input som streng ved feil
    }
}

export function formatNumber(number) {
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

export function isStringEmpty(value) {
    return value === undefined || value === null || value.trim().length === 0;
}

export function isValidUrl(input) {
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

export function isValidTelephone(input) {
    const formatted = input.trim().replaceAll(/[() .,-]/g, "");
    const pattern = /^\+?[0-9]{0,20}$/;
    return pattern.test(formatted);
}

export function isValidEmail(input) {
    // Regex from https://emailregex.com
    const pattern =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return pattern.test(input);
}

export function containsEmail(input) {
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

export function extractEmail(input) {
    // Regex from https://emailregex.com
    const preprocessedInput = input.replace(/&#64;/g, "@");
    const pattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;

    return preprocessedInput.match(pattern);
}

export function mailtoInString(input, email) {
    const pattern = new RegExp(`mailto:${email}`, "g");

    return pattern.test(input);
}

export function extractParam(param, nullValue) {
    let value = nullValue;

    window.location.search.split("&").forEach((q) => {
        const split = q.split("=");

        if (split.length === 2 && split[0].includes(param)) {
            // eslint-disable-next-line prefer-destructuring
            value = split[1];
        }
    });

    return value;
}

export const mediumDisplayName = (medium) => {
    if (medium === "EURES") return "NKSE";
    return medium;
};

export const JobPostingTextEnum = {
    STRUKTURERT: "strukturert",
    IKKE_STRUKTURERT: "ikkeStrukturert",
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

    validate(value) {
        return Object.values(SortByEnum).includes(value);
    },
});
