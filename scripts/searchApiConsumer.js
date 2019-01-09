const rp = require('request-promise');
const { searchTemplate, suggestionsTemplate } = require('./searchApiTemplates');

const host = process.env.DEV_PROFILE === 'true' ? 'http://localhost:9000' : 'http://pam-search-api';
const url = `${host}/stillingsok/ad/_search`;

/* eslint no-console: 0 */

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

exports.search = async (query = {}) => {
    const body = await bodyUsingTemplate(searchTemplate, query)
        .catch((error) => error);

    const options = {
        method: 'POST',
        json: true,
        url,
        body
    };

    return rp(options);
};

exports.suggestions = async (query = {}) => {
    const body = await bodyUsingTemplate(suggestionsTemplate, query.match, query.minLength)
        .catch((error) => error);

    const options = {
        method: 'POST',
        json: true,
        timeout: 8000,
        url,
        body
    };

    return rp(options);
};

exports.fetchStilling = async (uuid) => {
    const excludes = [
        'administration',
        'categoryList',
        'created',
        'createdBy',
        'employer.deactivated',
        'employer.employees',
        'employer.orgform',
        'employer.orgnr',
        'employer.parentOrgnr',
        'employer.properties',
        'employer.publicName',
        'employer.status',
        'expires',
        'geopoint',
        'mediaList',
        'privacy',
        'location.latitude',
        'location.longitude',
        'location.county',
        'properties.author',
        'properties.industry',
        'properties.keywords',
        'properties.occupation',
        'properties.searchtags',
        'properties.sourceupdated',
        'published',
        'updatedBy',
        'uuid'
    ].join(',');

    const path = `/stillingsok/ad/ad/${uuid}?_source_exclude=${excludes}`;
    const options = {
        method: 'GET',
        url: `${host}${path}`
    };

    return rp(options);
};
