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
    "desember"
];
export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function formatDate(isoString) {
    try {
        if (isValidISOString(isoString)) {
            const dt = isoString.split("-");
            const day = parseInt(dt[2].split("T")[0]);
            const month = months[parseInt(dt[1] - 1)];
            return `${day}. ${month} ${dt[0]}`;
        }
    } catch (error) {
        return isoString;
    }
    return isoString;
}

export function formatNumber(number) {
    try {
        return number.toLocaleString("no");
    } catch (err) {
        return number;
    }
}

export function userAgentIsInternetExplorer() {
    const userAgent = window.navigator.userAgent;
    return userAgent.indexOf("MSIE ") >= 0 || userAgent.indexOf("Trident/") >= 0;
}

export function isStringEmpty(value) {
    return value === undefined || value === null || value.trim().length === 0;
}

export function isValidUrl(input) {
    if (userAgentIsInternetExplorer()) {
        // Gracefully degrade, 'new URL(..)' is unsupported in IE
        return false;
    }

    try {
        return new URL(input).protocol.startsWith("http");
    } catch (e) {
        return false;
    }
}

export function isValidEmail(input) {
    // Regex from https://emailregex.com
    const pattern = new RegExp(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

    return pattern.test(input);
}

export function containsEmail(input) {
    // Regex from https://emailregex.com
    const preprocessedInput = input.replace(/&#64;/, "@");
    const pattern = new RegExp(
        /(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/
    );

    return pattern.test(preprocessedInput);
}

export function extractEmail(input) {
    // Regex from https://emailregex.com
    const preprocessedInput = input.replace(/&#64;/g, "@");
    const pattern = new RegExp(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi);

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
            value = split[1];
        }
    });

    return value;
}
