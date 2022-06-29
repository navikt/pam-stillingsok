const rp = require('request-promise');
const { searchTemplate, suggestionsTemplate } = require('./searchApiTemplates');

const host = process.env.PAMSEARCHAPI_URL ? process.env.PAMSEARCHAPI_URL : 'http://pam-search-api';
const internalSearchHost = process.env.PAM_INTERNAL_SEARCH_API_URL ? process.env.PAM_INTERNAL_SEARCH_API_URL : 'http://pam-internal-search-api';
const url = `${host}/stillingsok/ad/_search`;

const excludes = [
    'administration',
    'categoryList',
    'created',
    'createdBy',
    'employer.id',
    'employer.uuid',
    'employer.mediaList',
    'employer.contactList',
    'employer.createdBy',
    'employer.updatedBy',
    'employer.created',
    'employer.updated',
    'employer.deactivated',
    'employer.employees',
    'employer.orgform',
    'employer.orgnr',
    'employer.parentOrgnr',
    'employer.properties',
    'employer.publicName',
    'employer.status',
    'geopoint',
    'mediaList',
    'privacy',
    'location.latitude',
    'location.longitude',
    'location.county',
    'occupationList',
    'properties.author',
    'properties.industry',
    'properties.keywords',
    'properties.occupation',
    'properties.searchtags',
    'properties.sourceupdated',
    'updatedBy',
    'uuid'
].join(',');

/* eslint no-console: 0 */

exports.search = async (query = {}) => {
    try {
        const body = searchTemplate(query);

        const options = {
            method: 'POST',
            json: true,
            url,
            body
        };

        return rp(options);
    } catch (error) {
        console.error('Failed to parse query using template', error);
        return Promise.reject("Failed to parse query");
    }
};

exports.suggestions = async (query = {}) => {
    try {
        const body = suggestionsTemplate(query.match, query.minLength);

        const options = {
            method: 'POST',
            json: true,
            timeout: 8000,
            url,
            body
        };

        return rp(options);
    } catch (error) {
        console.error('Failed to parse query using template', error);
        return Promise.reject("Failed to parse query");
    }
};

exports.fetchStilling = async (uuid) => {
    const options = {
        method: 'GET',
        json: true,
        url: `${host}/stillingsok/ad/ad/${uuid}?_source_excludes=${excludes}`
    };

    return rp(options);
};

exports.fetchInternStilling = async (uuid) => {
    const options = {
        method: 'GET',
        json: true,
        url: `${internalSearchHost}/stillingsok/ad/${uuid}?_source_excludes=${excludes}`
    };

    return rp(options);
};
