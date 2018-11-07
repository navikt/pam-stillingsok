const rp = require('request-promise');

exports.search = (templateFunc, query = {}) => {
    const uri = 'http://localhost:9000/ad/_search';
    const options = {
        method: 'POST',
        uri: uri,
        body: templateFunc(query),
        json: true
    };

    return rp(options);
};
