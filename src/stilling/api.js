import { SearchApiError } from '../api/api';
import { SEARCH_API } from '../fasitProperties';

const filteredSource = {
    excludes: [
        "administration",
        "categoryList",
        "contactList",
        "created",
        "createdBy",
        "employer",
        "expires",
        "geopoint",
        "id",
        "location",
        "mediaList",
        "medium",
        "privacy",
        "properties.author",
        "properties.industry",
        "properties.keywords",
        "properties.occupation",
        "properties.searchtags",
        "properties.sourceupdated",
        "published",
        "updatedBy",
        "uuid"
    ]
};

export async function fetchStilling(id) {
    let excludeParamValue = filteredSource.excludes.join(',');
    const response = await fetch(`${SEARCH_API}/stillingsok/ad/ad/${id}?_source_exclude=${excludeParamValue}`, {
        method: 'GET'
    });
    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export default fetchStilling;
