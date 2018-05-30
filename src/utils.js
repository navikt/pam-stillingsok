export const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september',
    'oktober', 'november', 'desember'];

const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function toDate(isoString) {
    if (!isValidISOString(isoString)) {
        throw Error(`${isoString} is not a valid ISO 8601 date`);
    }
    return new Date(isoString);
}

export function toIsoDateString(year, month) {
    const monthAsInteger = parseInt(month, 10);
    const zeroPaddedMonth = monthAsInteger > 9 ? monthAsInteger : `0${monthAsInteger}`;
    const isoDateString = `${year}-${zeroPaddedMonth}`;
    if (!isValidISOString(isoDateString)) {
        throw Error(`One or more args are invalid: year=${year} month=${month}`);
    }
    return isoDateString;
}

export function formatISOString(isoString, format = 'MMMM YYYY') {
    if (isValidISOString(isoString)) {
        const dt = isoString.split('-');
        if (format === 'D. MMMM YYYY') {
            const day = dt[2].split('T')[0];
            return `${day}.${dt[1]}.${dt[0]}`;
        } else if (format === 'MMMM YYYY') {
            return `${months[dt[1] - 1]} ${dt[0]}`;
        }
        throw Error(`Unknown date format: ${format}`);
    }
    return '';
}

export function toUrlParams(query) {
    return Object.keys(query)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
        .join('&')
        .replace(/%20/g, '+');
}

export function getUrlParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, '\\$&');
    let regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
        results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

export default toDate;