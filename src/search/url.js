import { parse } from 'url';

/**
 * Tar en query-string og returnerer en Object-representasjon av stringen.
 * @param queryString   Query-stringen som skal parseres til et objekt.
 * @returns {Object}    En Object-representasjon av 'queryString'.
 */
export function toObject(queryString = '') {
    const object = parse(queryString, true).query;

    Object.keys(object).forEach((key) => {
        if (key.includes('[]')) {
            let value = object[key];

            if (!Array.isArray(value)) {
                value = [value];
            }

            const newKey = key.replace('[]', '');
            delete object[key];
            object[newKey] = value;
        }
    });

    return object;
}

function arrayToQueryString(key, array) {
    return array.map((val) => `${key}[]=${val}`)
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
            return `${key}=${object[key]}`;
        })
        .filter((elem) => elem !== '')
        .join('&')
        .replace(/\s/g, '%20');
    return `?${string}`;
}
