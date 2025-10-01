import { ExtentEnum } from "@/app/stillinger/_common/utils/utils";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from "./query";
import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { Locations } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";

type QueryField = {
    [field: string]: string | number | boolean | QueryField | QueryField[];
};

interface MatchQuery extends Record<string, unknown> {
    match?: QueryField;
    term?: QueryField;
    range?: {
        [field: string]: {
            gte?: number;
            lte?: number;
        } & Record<string, unknown>;
    };
}

interface BoolQuery {
    must?: MatchQuery[];
    should?: MatchQuery[];
    must_not?: MatchQuery[];
    filter?: MatchQuery[];
}

type Sort =
    | {
          [field: string]: {
              order: "asc" | "desc";
              [key: string]: string | number | boolean;
          } & Record<string, unknown>;
      }
    | "_score"
    | "_id";

interface TermQuery {
    term?: {
        [field: string]: string | number | boolean;
    };
}
// OpenSearch request body
type OpenSearchRequestBody = {
    query?: BoolQuery | MatchQuery | TermQuery;
    sort?: Sort[];
    from?: number;
    size?: number;
    aggs?: {
        [aggName: string]: {
            terms?: {
                field: string;
                size?: number;
            };
            [key: string]: unknown;
        };
    };
    _source?: { includes: string[] };
} & Record<string, unknown>;

type TermFilter = {
    term: {
        [field: string]: string;
    };
};

type TermsFilter = {
    terms: {
        [field: string]: string[];
    };
};

type ExistsFilter = {
    exists: {
        field: string;
    };
};

type BoolFilter = {
    bool: {
        should?: (TermFilter | TermsFilter | ExistsFilter | BoolFilter | MatchQuery)[];
        must?:
            | (TermFilter | TermsFilter | ExistsFilter | BoolFilter | MatchQuery)
            | (TermFilter | TermsFilter | ExistsFilter | BoolFilter | MatchQuery)[];
        must_not?:
            | (TermFilter | TermsFilter | ExistsFilter | BoolFilter | MatchQuery)
            | (TermFilter | TermsFilter | ExistsFilter | BoolFilter | MatchQuery)[];
    } & Record<string, unknown>;
} & Record<string, unknown>;

type NestedFilter = {
    nested: {
        path: string;
        query: BoolFilter;
    };
};

const NOT_DEFINED = "Ikke oppgitt";

function mapSortByValue(value: string) {
    switch (value) {
        case "expires":
            return "expires";
        case "published":
        default:
            return "published";
    }
}

function mapSortByOrder(value: string) {
    if (value !== "published") {
        return "asc";
    }
    return "desc";
}

function filterPublished(published: string | undefined) {
    const filters = [];
    if (published) {
        filters.push({
            range: {
                published: {
                    gte: published,
                    time_zone: "CET",
                },
            },
        });
    }
    return filters;
}

type DrivingDistanceFilter = NestedFilter;

function filterWithinDrivingDistance(withinDrivingDistance: Locations | undefined): DrivingDistanceFilter {
    const filter: DrivingDistanceFilter = {
        nested: {
            path: "locationList",
            query: {
                bool: {
                    should: [],
                },
            },
        },
    };

    if (!withinDrivingDistance) {
        return filter;
    }

    const { postcodes, municipals, counties } = withinDrivingDistance;

    if (Array.isArray(postcodes)) {
        filter.nested.query.bool?.should?.push({
            terms: {
                "locationList.postalCode": postcodes,
            },
        });
    }

    if (Array.isArray(municipals)) {
        filter.nested.query.bool?.should?.push({
            bool: {
                must: [
                    {
                        bool: {
                            must_not: {
                                exists: {
                                    field: "locationList.postalCode",
                                },
                            },
                        },
                    },
                    {
                        terms: {
                            "locationList.municipal.keyword": municipals,
                        },
                    },
                ],
            },
        });
    }

    if (Array.isArray(counties)) {
        filter.nested.query.bool?.should?.push({
            bool: {
                must: [
                    {
                        bool: {
                            must_not: {
                                exists: {
                                    field: "locationList.postalCode",
                                },
                            },
                        },
                    },
                    {
                        bool: {
                            must_not: {
                                exists: {
                                    field: "locationList.municipal",
                                },
                            },
                        },
                    },
                    {
                        terms: {
                            "locationList.county.keyword": counties,
                        },
                    },
                ],
            },
        });
    }

    return filter;
}

function filterRemote(remote: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (remote && remote.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        remote.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    "properties.remote": item,
                },
            });
        });

        if (remote.includes("Ikke oppgitt")) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "properties.remote",
                            },
                        },
                    ],
                },
            });
        }

        filters.push(filter);
    }
    return filters;
}

function filterExtent(extent: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (extent && extent.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        extent.forEach((item) => {
            if (item === ExtentEnum.HELTID) {
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.HELTID,
                    },
                });
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.HELTID_OG_DELTID,
                    },
                });
            } else if (item === ExtentEnum.DELTID) {
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.DELTID,
                    },
                });
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.HELTID_OG_DELTID,
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        extent_facet: ExtentEnum.UKJENT,
                    },
                });
            }
        });
        filters.push(filter);
    }
    return filters;
}

function filterWorkLanguage(workLanguage: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (workLanguage && workLanguage.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        workLanguage.forEach((item) => {
            if (item === NOT_DEFINED) {
                filter.bool?.should?.push({
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "worklanguage_facet",
                                },
                            },
                        ],
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        worklanguage_facet: item,
                    },
                });
            }
        });
        filters.push(filter);
    }
    return filters;
}

function filterEducation(education: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (education && education.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        education.forEach((item) => {
            if (item === NOT_DEFINED) {
                filter.bool?.should?.push({
                    bool: {
                        must_not: [
                            {
                                exists: {
                                    field: "education_facet",
                                },
                            },
                        ],
                    },
                });
            } else {
                filter.bool?.should?.push({
                    term: {
                        education_facet: item,
                    },
                });
            }
        });
        filters.push(filter);
    }
    return filters;
}

function filterNeedDriversLicense(needDriversLicense: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (needDriversLicense && needDriversLicense.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        needDriversLicense.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    needDriversLicense_facet: item,
                },
            });
        });

        if (needDriversLicense.includes("Ikke oppgitt")) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "needDriversLicense_facet",
                            },
                        },
                    ],
                },
            });
        }

        filters.push(filter);
    }
    return filters;
}

function filterUnder18(under18: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (under18 && under18.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        under18.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    under18_facet: item,
                },
            });
        });

        if (under18.includes("Ikke oppgitt")) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "under18_facet",
                            },
                        },
                    ],
                },
            });
        }

        filters.push(filter);
    }
    return filters;
}

function filterExperience(experience: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (experience && experience.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        experience.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    experience_facet: item,
                },
            });
        });

        if (experience.includes("Ikke oppgitt")) {
            filter.bool?.should?.push({
                bool: {
                    must_not: [
                        {
                            exists: {
                                field: "experience_facet",
                            },
                        },
                    ],
                },
            });
        }

        filters.push(filter);
    }
    return filters;
}

function filterEngagementType(engagementTypes: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (engagementTypes && engagementTypes.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        engagementTypes.forEach((engagementType) => {
            filter.bool?.should?.push({
                term: {
                    engagementtype_facet: engagementType,
                },
            });
        });
        filters.push(filter);
    }
    return filters;
}

/**
 * Lager filter for fasetter med flere nivå, feks fylke og kommune. Kombinerer AND og OR.
 * Feks (Akershus) OR (Buskerud) hvis man bare har valgt disse to fylkene.
 * Feks (Akershus AND (Asker OR Bærum)) OR (Buskerud AND Drammen) om man ser etter jobb i Asker, Bærum eller Drammen
 * Feks (Akershus) OR (Buskerud AND Drammen) om man ser etter jobb i hele Akershus fylke, men også i Drammen kommune.
 */
function filterNestedFacets(
    parents: string[] | undefined,
    children: string[],
    parentKey: string,
    childKey: string,
    nestedField?: string,
) {
    let allMusts: Array<Array<TermFilter | BoolFilter>> = [];
    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            let must: (TermFilter | BoolFilter)[] = [
                {
                    term: {
                        [parentKey]: parent,
                    },
                },
            ];

            const childrenOfCurrentParent = children.filter((m) => m.split(".")[0] === parent);
            if (childrenOfCurrentParent.length > 0) {
                must = [
                    ...must,
                    {
                        bool: {
                            should: childrenOfCurrentParent.map((child) => ({
                                term: {
                                    [childKey]: child.split(".")[1], // child kan feks være AKERSHUS.ASKER
                                },
                            })),
                        },
                    },
                ];
            }

            allMusts = [...allMusts, must];
        });
    }

    const queryObject: BoolFilter = {
        bool: {
            should: allMusts.map((must) => ({
                bool: {
                    must: must,
                },
            })),
        },
    };

    return nestedField
        ? {
              nested: {
                  path: nestedField,
                  query: queryObject,
              },
          }
        : queryObject;
}

const specialMunicipals = {
    OS: ["OS (INNLANDET)"],
    SANDE: ["SANDE (MØRE OG ROMSDAL)"],
    BØ: ["BØ (NORDLAND)"],
    NES: ["NES (VIKEN)", "NES (AKERSHUS)"],
} as const;

// Filtrer på alle type locations (land, kommune, fylke, internasjonalt)
function filterLocation(
    counties: string[] | undefined,
    municipals: string[] | undefined,
    countries: string[] | undefined,
    international: boolean = false,
) {
    const filter: NestedFilter = {
        nested: {
            path: "locationList",
            query: {
                bool: {
                    should: [],
                },
            },
        },
    };

    if (Array.isArray(counties)) {
        const countiesComputed: { key: string; municipals: string[] }[] = [];

        counties.forEach((c) => {
            countiesComputed.push({
                key: c,
                municipals: Array.isArray(municipals) ? municipals.filter((m) => m.split(".")[0] === c) : [],
            });
        });

        countiesComputed.forEach((c) => {
            const must: (TermFilter | BoolFilter)[] = [
                {
                    term: {
                        "locationList.county.keyword": c.key,
                    },
                },
            ];

            if (c.municipals.length > 0) {
                let mustObject: BoolFilter = {
                    bool: {
                        should: [],
                    },
                };

                if (countries && countries.includes("Hack")) {
                    mustObject = {
                        bool: {
                            should: [
                                {
                                    bool: {
                                        must_not: {
                                            exists: {
                                                field: "locationList.municipal.keyword",
                                            },
                                        },
                                    },
                                },
                            ],
                        },
                    };
                }

                c.municipals.forEach((m) => {
                    const municipal = m.split(".")[1] as keyof typeof specialMunicipals;
                    if (municipal in specialMunicipals) {
                        mustObject.bool?.should?.push({
                            terms: {
                                "locationList.municipal.keyword": [municipal, ...specialMunicipals[municipal]],
                            },
                        });
                    } else {
                        mustObject.bool?.should?.push({
                            term: {
                                "locationList.municipal.keyword": municipal,
                            },
                        });
                    }
                });

                must.push(mustObject);
            }

            filter.nested.query.bool?.should?.push({
                bool: {
                    must,
                },
            });
        });
    }

    const internationalObject: BoolFilter = {
        bool: {},
    };

    if (international) {
        internationalObject.bool.must_not = {
            term: {
                "locationList.country.keyword": "NORGE",
            },
        };
    }

    if (Array.isArray(countries) && countries.length > 0) {
        internationalObject.bool.should = [
            ...countries.map((c) => ({
                term: {
                    "locationList.country.keyword": c,
                },
            })),
        ];
    }

    if (
        Object.keys(internationalObject.bool).includes("must_not") ||
        Object.keys(internationalObject.bool).includes("should")
    ) {
        filter.nested.query.bool?.should?.push(internationalObject);
    }

    return filter;
}

function filterOccupation(occupationFirstLevels: string[] | undefined, occupationSecondLevels: string[] = []) {
    return filterNestedFacets(
        occupationFirstLevels,
        occupationSecondLevels,
        "occupationList.level1",
        "occupationList.level2",
        "occupationList",
    );
}

function filterSector(sector: string[] | undefined) {
    const filters: BoolFilter[] = [];
    if (sector && sector.length > 0) {
        const filter: BoolFilter = {
            bool: {
                should: [],
            },
        };
        sector.forEach((item) => {
            filter.bool?.should?.push({
                term: {
                    sector_facet: item,
                },
            });
        });
        filters.push(filter);
    }
    return filters;
}

function mainQueryTemplateFunc(qAsArray: string[]): BoolFilter {
    const matchFields = [
        "category_name_no^2",
        "title_no^2",
        "keywords_no^1",
        "searchtagsai_no^1",
        "searchtags_no^1",
        "adtext_no^0.1",
        "employerdescription_no^0.1",
    ];

    return {
        bool: {
            must: {
                bool: {
                    should: [
                        ...baseFreeTextSearchMatch(qAsArray, matchFields),
                        ...businessNameFreeTextSearchMatch(qAsArray),
                        ...geographyAllTextSearchMatch(qAsArray),
                        ...englishWorkLanguageTextSearchMatch(qAsArray),
                        {
                            match: {
                                id: {
                                    query: qAsArray.join(" ").trim(),
                                    operator: "and",
                                    boost: 1,
                                },
                            },
                        },
                    ],
                },
            },
            should: [...titleFreeTextSearchMatch(qAsArray)],
            filter: {
                term: {
                    status: "ACTIVE",
                },
            },
        },
    };
}

function baseFreeTextSearchMatch(queries: string[], fields: string[]) {
    return queries.map((q) => ({
        multi_match: {
            query: q,
            type: "cross_fields",
            fields: fields,
            operator: "and",
            tie_breaker: 0.3,
            analyzer: "norwegian_custom",
            zero_terms_query: "all",
        },
    }));
}

function businessNameFreeTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match: {
            businessName: {
                query: q,
                fuzziness: "AUTO",
                max_expansions: 2,
                prefix_length: 1,
                operator: "and",
                boost: 2,
            },
        },
    }));
}

function geographyAllTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match_phrase: {
            geography_all: {
                query: q,
                slop: 0,
                boost: 2,
            },
        },
    }));
}

function englishWorkLanguageTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match_phrase: {
            "worklanguage_facet.synonym": {
                query: q,
                boost: 0.7,
            },
        },
    }));
}

function titleFreeTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match_phrase: {
            title: {
                query: q,
                slop: 2,
            },
        },
    }));
}

const elasticSearchRequestBody = (query: ExtendedQuery) => {
    const {
        from,
        size,
        counties,
        countries,
        experience,
        education,
        municipals,
        needDriversLicense,
        under18,
        extent,
        workLanguage,
        remote,
        engagementType,
        sector,
        published,
        occupationFirstLevels,
        occupationSecondLevels,
        international,
        withinDrivingDistance,
        explain,
    } = query;
    let { sort, q } = query;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.length === 0) {
        if (sort !== "expires") {
            sort = "published";
        }
        q = [""];
    }

    let template: OpenSearchRequestBody = {
        explain: explain === true,
        from: from || 0,
        size: size && ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(size) ? size : SEARCH_CHUNK_SIZE,
        track_total_hits: true,
        min_score: 0.7,
        query: mainQueryTemplateFunc(q),
        post_filter: {
            bool: {
                filter: [
                    ...filterNeedDriversLicense(needDriversLicense),
                    ...filterUnder18(under18),
                    ...filterExperience(experience),
                    ...filterExtent(extent),
                    ...filterEducation(education),
                    ...filterWorkLanguage(workLanguage),
                    ...filterRemote(remote),
                    filterLocation(counties, municipals, countries, international),
                    filterOccupation(occupationFirstLevels, occupationSecondLevels),
                    ...filterEngagementType(engagementType),
                    ...filterSector(sector),
                    ...filterPublished(published),
                    filterWithinDrivingDistance(withinDrivingDistance),
                ],
            },
        },
        _source: {
            includes: [
                "employer.name",
                "businessName",
                "properties.adtextFormat",
                "properties.employer",
                "properties.jobtitle",
                "properties.location",
                "properties.applicationdue",
                "properties.hasInterestform",
                "properties.needDriversLicense",
                "properties.under18",
                "properties.experience",
                "properties.education",
                "properties.workLanguage",
                "properties.remote",
                "locationList.postalCode",
                "locationList.city",
                "locationList.address",
                "locationList.municipal",
                "locationList.county",
                "locationList.country",
                "title",
                "published",
                "expires",
                "uuid",
                "status",
                "source",
                "medium",
                "reference",
                "categoryList.name",
                "categoryList.categoryType",
                "properties.keywords",
                "properties.searchtagsai",
                "properties.searchtags.label",
                "properties.searchtags.score",
                "occupationList.level1",
                "occupationList.level2",
            ],
        },
        aggs: {
            positioncount: {
                filter: {
                    bool: {
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
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
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
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
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
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
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterRemote(remote),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
                    },
                },
                aggs: {
                    values: {
                        filters: {
                            filters: {
                                Heltid: {
                                    bool: {
                                        should: [
                                            { term: { extent_facet: "Heltid" } },
                                            { term: { extent_facet: "Heltid_and_Deltid" } },
                                        ],
                                    },
                                },
                                Deltid: {
                                    bool: {
                                        should: [
                                            { term: { extent_facet: "Deltid" } },
                                            { term: { extent_facet: "Heltid_and_Deltid" } },
                                        ],
                                    },
                                },
                                "Ikke oppgitt": {
                                    term: { extent_facet: "Ukjent" },
                                },
                            },
                        },
                    },
                },
            },
            remote: {
                filter: {
                    bool: {
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
                    },
                },
                aggs: {
                    values: {
                        terms: { field: "properties.remote", missing: NOT_DEFINED },
                    },
                },
            },
            workLanguage: {
                filter: {
                    bool: {
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterRemote(remote),
                            ...filterEducation(education),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
                    },
                },
                aggs: {
                    values: {
                        terms: { field: "worklanguage_facet", missing: NOT_DEFINED },
                    },
                },
            },
            education: {
                filter: {
                    bool: {
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterRemote(remote),
                            ...filterWorkLanguage(workLanguage),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
                    },
                },
                aggs: {
                    values: {
                        terms: { field: "education_facet", missing: NOT_DEFINED },
                    },
                },
            },
            needDriversLicense: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterUnder18(under18),
                            ...filterRemote(remote),
                            ...filterWorkLanguage(workLanguage),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
                    },
                },
                aggs: {
                    values: {
                        terms: { field: "needDriversLicense_facet", missing: NOT_DEFINED },
                    },
                },
            },
            under18: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterRemote(remote),
                            ...filterWorkLanguage(workLanguage),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
                    },
                },
                aggs: {
                    values: {
                        terms: { field: "under18_facet", missing: NOT_DEFINED },
                    },
                },
            },
            experience: {
                filter: {
                    bool: {
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterRemote(remote),
                            ...filterWorkLanguage(workLanguage),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                        ],
                    },
                },
                aggs: {
                    values: {
                        terms: { field: "experience_facet", missing: NOT_DEFINED },
                    },
                },
            },
            engagementType: {
                filter: {
                    bool: {
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
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
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
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
                        filter: [
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
                        ],
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
                            ...filterNeedDriversLicense(needDriversLicense),
                            ...filterUnder18(under18),
                            ...filterExperience(experience),
                            ...filterExtent(extent),
                            ...filterEducation(education),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
                            filterWithinDrivingDistance(withinDrivingDistance),
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
        },
    };

    if (sort && sort !== "relevant") {
        template = {
            ...template,
            sort: [
                {
                    [mapSortByValue(sort)]: {
                        order: mapSortByOrder(sort),
                    },
                },
                "_score",
                "_id",
            ],
        };
    }

    return template;
};

export default elasticSearchRequestBody;
