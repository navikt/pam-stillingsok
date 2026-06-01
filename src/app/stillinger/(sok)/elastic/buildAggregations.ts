import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { buildAllFilters } from "@/app/stillinger/(sok)/elastic/filter/buildAllFilters";
import { IKKE_OPPGITT } from "@/app/stillinger/(sok)/elastic/filter/constants";
import { ExtentEnum } from "@/app/stillinger/(sok)/elastic/filter/filterExtent";

export default function buildAggregations(query: ExtendedQuery) {
    return {
        positioncount: {
            filter: {
                bool: {
                    filter: buildAllFilters(query),
                },
            },
            aggs: {
                sum: {
                    sum: {
                        field: "properties.positioncount",
                        missing: 1,
                    },
                },
            },
        },
        published: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "published"),
                },
            },
            aggs: {
                range: {
                    date_range: {
                        field: "published",
                        time_zone: "CET",
                        ranges: [
                            {
                                key: "now/d",
                                from: "now/d",
                            },
                            {
                                key: "now-3d",
                                from: "now-3d",
                            },
                            {
                                key: "now-7d",
                                from: "now-7d",
                            },
                        ],
                    },
                },
            },
        },
        sector: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "sector"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "sector_facet" },
                },
            },
        },
        extent: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "extent"),
                },
            },
            aggs: {
                values: {
                    filters: {
                        filters: {
                            Heltid: {
                                bool: {
                                    should: [
                                        { term: { extent_facet: ExtentEnum.HELTID } },
                                        { term: { extent_facet: ExtentEnum.HELTID_OG_DELTID } },
                                    ],
                                },
                            },
                            Deltid: {
                                bool: {
                                    should: [
                                        { term: { extent_facet: ExtentEnum.DELTID } },
                                        { term: { extent_facet: ExtentEnum.HELTID_OG_DELTID } },
                                    ],
                                },
                            },
                            "Ikke oppgitt": {
                                term: { extent_facet: ExtentEnum.UKJENT },
                            },
                        },
                    },
                },
            },
        },
        remote: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "remote"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "remote_facet", missing: IKKE_OPPGITT },
                },
            },
        },
        workLanguage: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "workLanguage"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "worklanguage_facet", missing: IKKE_OPPGITT },
                },
            },
        },
        education: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "education"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "education_facet", missing: IKKE_OPPGITT },
                },
            },
        },
        needDriversLicense: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "needDriversLicense"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "needDriversLicense_facet", missing: IKKE_OPPGITT },
                },
            },
        },
        under18: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "under18"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "under18_facet", missing: IKKE_OPPGITT },
                },
            },
        },
        experience: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "experience"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "experience_facet", missing: IKKE_OPPGITT },
                },
            },
        },
        engagementType: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "engagementType"),
                },
            },
            aggs: {
                values: {
                    terms: { field: "engagementtype_facet" },
                },
            },
        },
        counties: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "location"),
                },
            },
            aggs: {
                nestedLocations: {
                    nested: {
                        path: "locationList",
                    },
                    aggs: {
                        values: {
                            terms: {
                                field: "locationList.county.keyword",
                                size: 50,
                                order: {
                                    _key: "asc",
                                },
                            },
                            aggs: {
                                root_doc_count: {
                                    reverse_nested: {},
                                },
                                municipals: {
                                    terms: {
                                        field: "locationList.municipal.keyword",
                                        size: 200,
                                        order: {
                                            _key: "asc",
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        occupations: {
            filter: {
                bool: {
                    filter: buildAllFilters(query, "occupation"),
                },
            },
            aggs: {
                nestedOccupations: {
                    nested: {
                        path: "occupationList",
                    },
                    aggs: {
                        occupationFirstLevels: {
                            terms: {
                                field: "occupationList.level1",
                                size: 50,
                            },
                            aggs: {
                                root_doc_count: {
                                    reverse_nested: {},
                                },
                                occupationSecondLevels: {
                                    terms: {
                                        field: "occupationList.level2",
                                        size: 100,
                                    },
                                    aggs: {
                                        root_doc_count: {
                                            reverse_nested: {},
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
        countries: {
            filter: {
                bool: {
                    filter: [
                        ...buildAllFilters(query, "location"),
                        {
                            nested: {
                                path: "locationList",
                                query: {
                                    bool: {
                                        must_not: {
                                            term: {
                                                "locationList.country.keyword": "NORGE",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    ],
                },
            },
            aggs: {
                nestedLocations: {
                    nested: {
                        path: "locationList",
                    },
                    aggs: {
                        values: {
                            terms: {
                                field: "locationList.country.keyword",
                                exclude: "NORGE",
                                size: 50,
                                order: {
                                    _key: "asc",
                                },
                            },
                        },
                    },
                },
            },
        },
    };
}
