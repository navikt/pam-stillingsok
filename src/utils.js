export const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september',
    'oktober', 'november', 'desember'];

const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function formatISOString(isoString, format = 'MMMM YYYY') {
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
    return isoString;
}

export function isValidUrl(input) {
    const pattern = new RegExp('^(https?:\\/\\/)' + // protocol (requires http://or https://)
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,})' + // domain name
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
        '(\\#[-a-z\\d_]*)?$','i'); // fragment locater

    if (pattern.test(input)) {
        return true;
    }
    return false;
}

export function isValidEmail(input) {
    // Regex hentet fra: https://www.w3.org/TR/html5/forms.html#valid-e-mail-address
    const pattern = new RegExp('^[a-zA-Z0-9.!#$%&\'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?' +
        '(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$');

    if (pattern.test(input)) {
        return true;
    }
    return false;
}
