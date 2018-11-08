const rp = require('request-promise');

exports.search = (templateFunc, query = {}) => {
    let body;
    try {
        body = templateFunc(query);
    } catch (error) {
        console.error('Failed to parse query using template', error);
        return Promise.reject(error);
    }

    const host = process.env.DEV_PROFILE === 'true' ? 'http://localhost:9000' : 'http://pam-search-api';
    const url = `${host}/ad/_search`;
    const options = {
        method: 'POST',
        url: url,
        body: body,
        json: true
    };

    return rp(options)
};
