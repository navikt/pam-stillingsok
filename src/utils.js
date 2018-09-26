export const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september',
    'oktober', 'november', 'desember'];

const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function formatISOString(isoString, format = 'MMMM YYYY') {
    try {
        if (isValidISOString(isoString)) {
            const dt = isoString.split('-');
            if (format === 'D. MMMM YYYY') {
                const day = dt[2].split('T')[0];
                return `${day}.${dt[1]}.${dt[0]}`;
            } else if (format === 'MMMM YYYY') {
                return `${months[dt[1] - 1]} ${dt[0]}`;
            } else if (format === 'DD.MMM') {
                const day = dt[2].split('T')[0];
                return `${day}. ${months[dt[1] - 1].substring(0, 3)}.`;
            }
        }
    } catch (error) {
        return isoString;
    }
    return isoString;
}

export function isValidUrl(input) {
    const pattern = new RegExp('^(https?:\\/\\/)' + // protocol (requires http://or https://)
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})' + // domain name
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locater

    if (pattern.test(input)) {
        return true;
    }
    return false;
}

