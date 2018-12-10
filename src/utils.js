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

export function isValidUrl(input) {
    const pattern = new RegExp('^(https?:\\/\\/)' // protocol (requires http://or https://)
        + '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})' // domain name
        + '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' // port and path
        + '(\\?[;&a-z\\d%_.~+=-]*)?' // query string
        + '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater

    return pattern.test(input);
}

export function isValidEmail(input) {
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
