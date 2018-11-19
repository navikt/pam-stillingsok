/**
 * Tar en query-string og returnerer en Object-representasjon av stringen.
 * @param queryString   Query-stringen som skal parseres til et objekt.
 * @returns {Object}    En Object-representasjon av 'queryString'.
 */
export function toObject(queryString = '') {
    if (!queryString) {
        queryString = '';
    }
    const parameters = queryString.substring(1).split('&');
    const object = {};

    parameters.forEach((parameter) => {
        const pair = parameter.split('=');
        if (pair[0] !== undefined || pair[0] !== '') {
            let key = decodeURIComponent(pair[0]);
            let val = pair[1] !== undefined ? decodeURIComponent(pair[1]) : '';

            if (key.includes('[]')) {
                key = key.replace('[]', '');

                if (object[key] === undefined) {
                    object[key] = [val];
                } else {
                    object[key].push(val);
                }
            } else {
                object[key] = val;
            }
        }
    });

    return object;
}

function arrayToQueryString(key, array) {
    return array.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`)
        .join('&');
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
            if (Array.isArray(value)) {
                return arrayToQueryString(key, value);
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(object[key])}`;
        })
        .filter((elem) => elem !== '')
        .join('&');
    return `?${string}`;
}
