/* eslint-disable no-underscore-dangle */
import typeaheadTemplate from './templates/typeaheadTemplate';
import searchTemplate from './templates/searchTemplate';
import { SEARCH_API } from '../fasitProperties';

export class SearchApiError {
    constructor(message, statusCode) {
        this.message = message;
        this.statusCode = statusCode;
    }
}

async function post(query) {
    let response;
    try {
        response = await fetch(`${SEARCH_API}/stillingsok/ad/_search`, {
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

export async function fetchSearch(query = {}) {
    const result = await post(searchTemplate(query));
    return {
        stillinger: result.hits.hits.map((stilling) => (
            stilling._source
        )),
        total: result.hits.total,
        counties: result.aggregations.counties.values.buckets.map((county) => ({
            key: county.key,
            count: county.doc_count,
            municipals: county.municipals.buckets.map((municipal) => ({
                key: municipal.key,
                count: municipal.doc_count
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
        created: result.aggregations.created.range.buckets.map((item) => ({
            key: item.key,
            count: item.doc_count
        }))
    };
}

export async function fetchTypeaheadSuggestions(match) {
    const result = await post(typeaheadTemplate(match));

    const allSuggestions = [
        ...result.suggest.yrkeskategori[0].options.map((typeaheadOption) => typeaheadOption.text),
        ...result.suggest.searchtags[0].options.map((typeaheadOption) => typeaheadOption.text)
    ];

    return {
        match,
        result: [...new Set(allSuggestions)] // Bruker Set for å fjerne duplikate suggestions
    };
}

