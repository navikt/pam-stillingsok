const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function formatISOString(isoString, format = 'DD.MM.YYYY') {
    try {
        if (isValidISOString(isoString)) {
            const dt = isoString.split('-');
            if (format === 'DD.MM.YYYY') {
                const day = dt[2].split('T')[0];
                return `${day}.${dt[1]}.${dt[0]}`;
            }
            return isoString;
        }
    } catch (error) {
        return isoString;
    }
    return isoString;
}

export function userAgentIsInternetExplorer() {
    const userAgent = window.navigator.userAgent;
    return userAgent.indexOf('MSIE ') >= 0 || userAgent.indexOf('Trident/') >= 0;
}

export function isValidUrl(input) {
    if (userAgentIsInternetExplorer()) {
        // Gracefully degrade, 'new URL(..)' is unsupported in IE
        return false;
    }

    try {
        return new URL(input).protocol.startsWith('http');
    } catch (e) {
        return false;
    }
}

export function isValidEmail(input) {
    // Regex from https://emailregex.com
    const pattern = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);

    return pattern.test(input);
}

export function removeUndefinedOrEmptyString(obj) {
    const newObj = {};
    Object.keys(obj).forEach((prop) => {
        if (obj[prop] !== undefined && obj[prop] !== '') {
            newObj[prop] = obj[prop];
        }
    });
    return newObj;
}

export const isMobile = () => window.matchMedia('(max-width: 991px)').matches;
