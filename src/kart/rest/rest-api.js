import RestApiError from './RestApiError';

async function rest(url, options) {
    let response = await fetch(url, options);

    if (response.status >= 400) {
        let error;
        try {
            error = await response.json();
        } catch (e) {
            throw new RestApiError({
                error: 'UNKNOWN',
                status: response.status,
                message: response.statusText
            });
        }
        throw new RestApiError(error);
    } else if (response.status === 200 || response.status === 201) {
        response = await response.json();
    }
    return response;
}

const convertToUrlParams = (query) => Object.keys(query)
    .map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join('&')
    .replace(/%20/g, '+');

const seperator = (url) => (url.indexOf('?') !== -1 ? '&' : '?');

export const get = (url, query) => rest(
    query !== undefined ? `${url}${seperator(url)}${convertToUrlParams(query)}` : url, {
        method: 'GET'
    });

export const add = (url, body) => rest(url, {
    body: JSON.stringify(body),
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    }

});

export const update = (url, body) => rest(url, {
    body: JSON.stringify(body),
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json'
    }
});

export const remove = (url, query) => rest(
    query !== undefined ? url + convertToUrlParams(query) : url, {
        method: 'DELETE'
    });

