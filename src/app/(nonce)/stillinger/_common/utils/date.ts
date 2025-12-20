const ISO_8601_DATE = /^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$/i;

function isValidISOString(isoString: string) {
    return ISO_8601_DATE.test(isoString);
}

export default function formatISOString(isoString: string, format = "DD.MM.YYYY") {
    try {
        if (isValidISOString(isoString)) {
            const dt = isoString.split("-");
            if (format === "DD.MM.YYYY") {
                const day = dt[2].split("T")[0];
                return `${day}.${dt[1]}.${dt[0]}`;
            }
            return isoString;
        }
    } catch {
        return isoString;
    }
    return isoString;
}
