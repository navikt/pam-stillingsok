/**
 * Search params on Next.js server side is grouped in a way that is not supported by URLSearchParams constructor
 * This function parses searchParams end returns a new URLSearchParams object
 * @param searchParams
 * @returns {module:url.URLSearchParams}
 */
export default function searchParamsToURLSearchParams(searchParams) {
    const result = [];

    Object.entries(searchParams).forEach(([key, value]) => {
        if (Array.isArray(searchParams[key])) {
            value.forEach((item) => {
                result.push([key, item]);
            });
        } else {
            result.push([key, value]);
        }
    });
    return new URLSearchParams(result);
}
