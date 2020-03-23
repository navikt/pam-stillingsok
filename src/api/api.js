/* eslint-disable no-underscore-dangle */
import SearchApiError from './SearchApiError';
import {stringifyQueryObject} from '../utils';
import {CONTEXT_PATH} from "../fasitProperties";

/* eslint-disable no-underscore-dangle */

export async function get(url) {
    let response;
    try {
        response = await fetch(url, {
            method: 'GET',
            referrer: CONTEXT_PATH
        });
    } catch (e) {
        throw new SearchApiError(e.message, 0);
    }

    if (response.status !== 200) {
        throw new SearchApiError(response.statusText, response.status);
    }
    return response.json();
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

export async function fetchLocations() {
    return await get(`${CONTEXT_PATH}/api/locations`);
}

export async function fetchSearch(query = {}) {
    const queryString = stringifyQueryObject(query);
    const result = await get(`${CONTEXT_PATH}/api/search${queryString}`);

    // Map containing geo keys : count of hits
    const nationalCountMap = {};
    const internationalCountMap = {};

    result.aggregations.counties.nestedLocations.values.buckets.forEach(c => {
        nationalCountMap[c.key] = c.doc_count;

        c.municipals.buckets.forEach(m => {
            nationalCountMap[`${c.key}.${m.key}`] = m.doc_count;
        });
    });

    result.aggregations.countries.nestedLocations.values.buckets.forEach(c => {
        internationalCountMap[c.key.toUpperCase()] = c.doc_count;
    });

    return {
        stillinger: result.hits.hits.map((stilling) => (
            fixStilling(stilling._source)
        )),
        nationalCountMap,
        internationalCountMap,
        total: result.hits.total,
        positioncount: result.aggregations.positioncount.sum.value,
        occupationFirstLevels: result.aggregations.occupations.nestedOccupations.occupationFirstLevels.buckets.map((firstLevel) => ({
            key: firstLevel.key,
            count: firstLevel.root_doc_count.doc_count,
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
    const queryString = stringifyQueryObject({match, minLength});
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

export async function fetchInternStilling(uuid) {
    return get(`${CONTEXT_PATH}/api/intern/${uuid}`);
}
