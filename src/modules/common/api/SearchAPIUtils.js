function fixMissingAdProperties(stilling) {
    if (stilling.properties === undefined) {
        return {
            ...stilling,
            properties: {},
        };
    }
    return stilling;
}

/**
 * This function extract and return only the search result information
 * we need, and make response less nested.
 */
export default async function simplifySearchResponse(response) {
    const nationalCountMap = {};
    const internationalCountMap = {};

    response.aggregations.counties.nestedLocations.values.buckets.forEach((c) => {
        nationalCountMap[c.key] = c.root_doc_count.doc_count;

        c.municipals.buckets.forEach((m) => {
            nationalCountMap[`${c.key}.${m.key}`] = m.doc_count;
        });
    });

    response.aggregations.countries.nestedLocations.values.buckets.forEach((c) => {
        internationalCountMap[c.key.toUpperCase()] = c.doc_count;
    });

    return {
        ads: response.hits.hits.map((stilling) => fixMissingAdProperties(stilling._source)),
        totalAds: response.hits.total.value,
        totalPositions: response.aggregations.positioncount.sum.value,
        totalInternational: response.aggregations.countries.doc_count,
        aggregations: {
            nationalCountMap,
            internationalCountMap,
            remote: response.aggregations.remote ? response.aggregations.remote.values.buckets : [],
            occupationFirstLevels:
                response.aggregations.occupations.nestedOccupations.occupationFirstLevels.buckets.map((firstLevel) => ({
                    key: firstLevel.key,
                    count: firstLevel.root_doc_count.doc_count,
                    occupationSecondLevels: firstLevel.occupationSecondLevels.buckets.map((secondLevel) => ({
                        key: `${firstLevel.key}.${secondLevel.key}`,
                        label: secondLevel.key,
                        count: secondLevel.root_doc_count.doc_count,
                    })),
                })),
            extent: response.aggregations.extent.values.buckets.map((item) => ({
                key: item.key,
                count: item.doc_count,
            })),
            engagementTypes: response.aggregations.engagementType.values.buckets.map((item) => ({
                key: item.key,
                count: item.doc_count,
            })),
            published: response.aggregations.published.range.buckets.map((item) => ({
                key: item.key,
                count: item.doc_count,
            })),
            sector: response.aggregations.sector.values.buckets.map((item) => ({
                key: item.key,
                count: item.doc_count,
            })),
        },
    };
}
