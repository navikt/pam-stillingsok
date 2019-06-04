/* eslint-disable no-underscore-dangle */
import SearchApiError from './SearchApiError';
import { toQueryString } from '../search/url';
import {CONTEXT_PATH} from "../fasitProperties";

/* eslint-disable no-underscore-dangle */

export async function get(url) {
    let response;
    try {
        response = await fetch(url, {
            method: 'GET',
            referrer: ''
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function post(url, query) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function put(url, query) {
    let response;
    try {
        response = await fetch(url, {
            body: JSON.stringify(query),
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
}

export async function remove(url) {
    let response;
    try {
        response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response;
}

function fixStilling(stilling) {
    if (stilling.properties === undefined) {
        return {
            ...stilling,
            properties: {}
        };
    }
    return stilling;
}

export async function fetchSearch(query = {}) {
    const queryString = toQueryString(query);
    const result = await get(`${CONTEXT_PATH}/api/search${queryString}`);

    return {
        stillinger: result.hits.hits.map((stilling) => (
            fixStilling(stilling._source)
        )),
        total: result.hits.total,
        positioncount: result.aggregations.positioncount.sum.value,
        counties: result.aggregations.counties.nestedLocations.values.buckets.map((county) => ({
            key: county.key,
            count: county.root_doc_count.doc_count, // Count number of root docs (ads) per bucket, instead of number of matching nested objects
            municipals: county.municipals.buckets.map((municipal) => ({
                key: `${county.key}.${municipal.key}`,
                label: municipal.key,
                count: municipal.doc_count
            }))
        })),
        occupationFirstLevels: result.aggregations.occupationFirstLevels.values.buckets.map((firstLevel) => ({
            key: firstLevel.key,
            count: firstLevel.doc_count,
            occupationSecondLevels: firstLevel.occupationSecondLevels.buckets.map((secondLevel) => ({
                key: `${firstLevel.key}.${secondLevel.key}`,
                label: secondLevel.key,
                count: secondLevel.doc_count
            }))
        })),
        extent: result.aggregations.extent.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        countries: result.aggregations.countries.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        engagementTypes: result.aggregations.engagementType.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        sector: result.aggregations.sector.values.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        })),
        published: result.aggregations.published.range.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        }))
    };
}

export async function fetchCategoryAndSearchTagsSuggestions(match, minLength) {
    const queryString = toQueryString({ match, minLength });
    const result = await get(`${CONTEXT_PATH}/api/suggestions${queryString}`);

    return {
        match,
        result: [...new Set([ // Bruker Set for å fjerne duplikater på tvers av category_suggest og searchtags_suggest
            ...result.suggest.category_suggest[0].options.map((suggestion) => suggestion.text),
            ...result.suggest.searchtags_suggest[0].options.map((suggestion) => suggestion.text)
        ].sort())]
    };
}

export async function fetchStilling(uuid) {
    return get(`${CONTEXT_PATH}/api/stilling/${uuid}`);
}
