import { SEARCH_API } from '../common/fasitProperties';

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
        "status",
        "updatedBy",
        "uuid"
    ]
};

export async function fetchStilling(id) {
    const response = await fetch(`${SEARCH_API}/ad/_search`, {
        body: JSON.stringify({
            query: {
                terms: {
                    _id: [id]
                }
            },
            _source: {
                ...filteredSource
            }
        }),
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return response.json();
}

export default fetchStilling;
