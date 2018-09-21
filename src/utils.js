export const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september',
    'oktober', 'november', 'desember'];

const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

export function isValidISOString(isoString) {
    return ISO_8601_DATE.test(isoString);
}

export function formatISOString(isoString, format = 'MMMM YYYY') {
    if (isValidISOString(isoString)) {
        const dt = isoString.split('-');
        const year = dt[0];
        const month = dt[1];
        const monthName = months[month - 1];
        const dayAndTime = dt[2].split('T');
        const day = dayAndTime[0];
        const dayWithoutZero = day.substring(0, 1) === '0' ? day.substring(1) : day;
        const time = dayAndTime[1].split(':');
        const hours = time[0];
        const mins = time[1];
        if (format === 'D. MMMM YYYY') {
            return `${dayWithoutZero}.${dt[1]}.${dt[0]}`;
        } else if (format === 'DD.MM.YYYY') {
            return `${day}.${month}.${year}`;
        } else if (format === 'MMMM YYYY') {
            return `${months[dt[1] - 1]} ${dt[0]}`;
        } else if (format === 'DD.MMM') {
            return `${day}. ${months[dt[1] - 1].substring(0, 3)}.`;
        } else if (format === 'D. MMM YYYY HH:MM') {
            return `${dayWithoutZero}. ${monthName.substring(0, 3)} ${year} ${hours}:${mins}`;
        }
    }
    return isoString;
}
