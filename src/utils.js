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
        throw Error(`Unknown date format: ${format}`);
    }
    return '';
}

export default toDate;