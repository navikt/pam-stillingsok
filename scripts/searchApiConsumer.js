const rp = require('request-promise');
const { searchTemplate, suggestionsTemplate } = require('./searchApiTemplates');

const host = process.env.DEV_PROFILE === 'true' ? 'http://localhost:9000' : 'http://pam-search-api';
const url = `${host}/ad/_search`;

exports.search = async (query = {}) => {
    const body = await bodyUsingTemplate(searchTemplate, query)
        .catch(function(error) { return error; });

    const options = {
        method: 'POST',
        url: url,
        body: body,
        json: true
    };

    return rp(options)
};

exports.suggestions = async (query = {}) => {
    const body = await bodyUsingTemplate(suggestionsTemplate, query.match, query.minLength)
        .catch(function(error) { return error; });

    const options = {
        method: 'POST',
        url: url,
        body: body,
        json: true
    };

    return rp(options)
};

const bodyUsingTemplate = (template, ...args) => {
    let body;
    try {
        body = template(...args);
    } catch (error) {
        console.error('Failed to parse query using template', error);
        return Promise.reject(error);
    }

    return Promise.resolve(body);
};