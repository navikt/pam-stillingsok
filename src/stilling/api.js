import { SearchApiError } from '../api/api';
import { SEARCH_API } from '../fasitProperties';

const filteredSource = {
    excludes: [
        'administration',
        'categoryList',
        'contactList',
        'created',
        'createdBy',
        'employer',
        'expires',
        'geopoint',
        'id',
        'location',
        'mediaList',
        'medium',
        'privacy',
        'properties.author',
        'properties.industry',
        'properties.keywords',
        'properties.occupation',
        'properties.searchtags',
        'properties.sourceupdated',
        'published',
        'updatedBy',
        'uuid'
    ]
};

export async function fetchStilling(id) {
    const excludeParamValue = filteredSource.excludes.join(',');
    let response;
    try {
        response = await fetch(`${SEARCH_API}/stillingsok/ad/ad/${id}?_source_exclude=${excludeParamValue}`, {
            method: 'GET'
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }
    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export default fetchStilling;
