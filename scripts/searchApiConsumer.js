const rp = require('request-promise');

exports.search = (templateFunc, query = {}) => {
    const host = process.env.DEV_PROFILE === 'true' ? 'http://localhost:9000' : 'http://pam-search-api';
    const url = `${host}/ad/_search`;
    const options = {
        method: 'POST',
        url: url,
        body: templateFunc(query),
        json: true
    };

    return rp(options);
};
