export const ParameterType = {
    ARRAY: 'ARRAY',
    STRING: 'STRING',
    NUMBER: 'NUMBER'
};

export function getUrlParameterByName(name, url) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return undefined;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}

/**
 * Takes an object representing the url query and transform it into a string
 * @param query: f.ex: {q: "Java", fruits: ["Apple", "Banana"], count: 10}
 * @returns {string} f.ex: q=Java&names=Apple_Banana&count=10
 */
export function toUrl(query) {
    let result = {};

    Object.keys(query).forEach((key) => {
        if (query[key] !== undefined) {
            if (Array.isArray(query[key])) {
                if (query[key].length > 0) {
                    result = {
                        ...result,
                        [key]: query[key].join('_')
                    };
                }
            } else if (query[key] !== '') {
                result = {
                    ...result,
                    [key]: query[key]
                };
            }
        }
    });

    const urlQuery = Object.keys(result)
        .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(result[key])}`)
        .join('&')
        .replace(/%20/g, '+');


    return urlQuery && urlQuery.length > 0 ? `?${urlQuery}` : '';
}

/**
 * Takes an url query string and extract url parameters and return them as in a query object
 * @param queryDefinition: f.ex: {q: ParameterType.STRING, fruits: ParameterType.ARRAY, count: ParameterType.NUMBER}
 * @param url: f.ex: q=Java&names=Apple_Banana&count=10
 * @returns {{}} f.ex: {q: "Java", fruits: ["Apple", "Banana"], count: 10}
 */
export function fromUrl(queryDefinition, url) {
    let result = {};
    Object.keys(queryDefinition).forEach((key) => {
        const urlParameter = getUrlParameterByName(key, url);
        if (urlParameter) {
            if (queryDefinition[key] === ParameterType.ARRAY) {
                result = {
                    ...result,
                    [key]: urlParameter.split('_')
                };
            } else if (queryDefinition[key] === ParameterType.NUMBER) {
                result = {
                    ...result,
                    [key]: parseInt(urlParameter, 10)
                };
            } else if (queryDefinition[key] === ParameterType.STRING) {
                result = {
                    ...result,
                    [key]: urlParameter
                };
            } else {
                throw Error(`Unsupported query type: ${queryDefinition[key]}`);
            }
        }
    });
    return result;
}
