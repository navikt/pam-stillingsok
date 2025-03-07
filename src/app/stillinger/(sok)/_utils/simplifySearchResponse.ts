import { mapHits, StillingSoekResponse } from "@/server/schemas/stillingSearchSchema";
import { SearchResult } from "@/app/stillinger/_common/_types/SearchResult";

/**
 * This function extract and return only the search result information
 * we need, and make response less nested.
 */
export default function simplifySearchResponse(response: StillingSoekResponse): SearchResult {
    const nationalCountMap: Record<string, number> = {};
    const internationalCountMap: Record<string, number> = {};

    response.aggregations?.counties.nestedLocations.values?.buckets?.forEach((c) => {
        nationalCountMap[c.key] = c.root_doc_count.doc_count;

        c.municipals.buckets?.forEach((m) => {
            nationalCountMap[`${c.key}.${m.key}`] = m.doc_count;
        });
    });

    response.aggregations?.countries.nestedLocations.values?.buckets?.forEach((c) => {
        if (c.key) {
            internationalCountMap[c.key.toUpperCase()] = c.doc_count;
        }
    });

    return {
        ads: response.hits.hits.map(mapHits),
        totalAds: response.hits.total.value,
        totalPositions: response.aggregations?.positioncount.sum.value,
        aggregations: {
            totalInternational: response.aggregations?.countries.doc_count,
            nationalCountMap,
            internationalCountMap,
            remote:
                response.aggregations?.remote.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            occupationFirstLevels:
                response.aggregations?.occupations.nestedOccupations.occupationFirstLevels?.buckets?.map(
                    (firstLevel) => ({
                        key: firstLevel.key,
                        count: firstLevel.root_doc_count?.doc_count,
                        occupationSecondLevels: firstLevel.occupationSecondLevels?.buckets.map((secondLevel) => ({
                            key: `${firstLevel.key}.${secondLevel.key}`,
                            label: secondLevel.key,
                            count: secondLevel.root_doc_count?.doc_count,
                        })),
                    }),
                ) || [],
            needDriversLicense:
                response.aggregations?.needDriversLicense.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            under18:
                response.aggregations?.under18.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            experience:
                response.aggregations?.experience.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            extent: Object.entries(response.aggregations?.extent.values?.buckets ?? {}).map(([key, value]) => ({
                key,
                count: value.doc_count,
            })),
            education:
                response.aggregations?.education.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            workLanguage:
                response.aggregations?.workLanguage?.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            engagementTypes:
                response.aggregations?.engagementType.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            publishedTotalCount: response.aggregations?.published.doc_count,
            published:
                response.aggregations?.published.range?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
            sector:
                response.aggregations?.sector.values?.buckets?.map((item) => ({
                    key: item.key,
                    count: item.doc_count,
                })) || [],
        },
    };
}
