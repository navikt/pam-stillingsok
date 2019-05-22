/**
 * Tar en query-string og returnerer en Object-representasjon av stringen.
 * @param queryString   Query-stringen som skal parseres til et objekt.
 * @returns {Object}    En Object-representasjon av 'queryString'.
 */
export function toObject(queryString = '?') {
    const parameters = queryString.substring(1).split('&');
    const object = {};

    parameters.forEach((parameter) => {
        const pair = parameter.split('=');
        if (pair[0] !== undefined || pair[0] !== '') {
            let key = decodeURIComponent(pair[0]);
            const values = pair[1] !== undefined ? pair[1].split("_") : [];
            values.forEach((value) => {
                const val = value !== undefined ? decodeURIComponent(value) : '';
                if (key.includes('[]')) {
                    const newKey = key.replace('[]', '');

                    if (object[newKey] === undefined) {
                        object[newKey] = [val];
                    } else {
                        object[newKey].push(val);
                    }
                } else {
                    object[key] = val;
                }
            });
        }
    });

    return object;
}

/**
 * Tar et objekt og returnerer en query-string-representasjon av objektet.
 * @param object        Objekt som skal gjøres om til en query-string.
 * @returns {string}    En query-string-representasjon av 'object'.
 */
export function toQueryString(object = {}) {
    const string = Object.keys(object)
        .map((key) => {
            const value = object[key];
            if (value === undefined || value === '' || (value && value.length === 0)) {
                return '';
            } else if (Array.isArray(value)) {
                return `${encodeURIComponent(key)}[]=${value.map((val) => encodeURIComponent(val)).join("_")}`;
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
        })
        .filter((elem) => elem !== '')
        .join('&');
    return `?${string}`;
}
