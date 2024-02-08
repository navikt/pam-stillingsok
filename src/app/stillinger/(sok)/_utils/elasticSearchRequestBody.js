const NOT_DEFINED = "Ikke oppgitt";
const useRemoteFilter = true;

function mapSortByValue(value) {
    switch (value) {
        case "expires":
            return "expires";
        case "published":
        default:
            return "published";
    }
}

function mapSortByOrder(value) {
    if (value !== "published") {
        return "asc";
    }
    return "desc";
}

function filterPublished(published) {
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

function filterExtent(extent) {
    const filters = [];
    if (extent && extent.length > 0) {
        const filter = {
            bool: {
                should: [],
            },
        };
        extent.forEach((item) => {
            filter.bool.should.push({
                term: {
                    extent_facet: item,
                },
            });
        });
        filters.push(filter);
    }
    return filters;
}

function filterWorkLanguage(workLanguage) {
    const filters = [];
    if (workLanguage && workLanguage.length > 0) {
        const filter = {
            bool: {
                should: [],
            },
        };
        workLanguage.forEach((item) => {
            if (item === NOT_DEFINED) {
                filter.bool.should.push({
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
                filter.bool.should.push({
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

function filterRemote(remote) {
    const filters = [];

    if (useRemoteFilter) {
        if (remote && remote.length > 0) {
            const filter = {
                bool: {
                    should: [],
                },
            };
            remote.forEach((item) => {
                filter.bool.should.push({
                    term: {
                        "properties.remote": item,
                    },
                });
            });
            filter.bool.should.push({
                match: {
                    adtext_no: "hjemmekontor",
                },
            });

            filters.push(filter);
        }
    }
    return filters;
}

function filterEngagementType(engagementTypes) {
    const filters = [];
    if (engagementTypes && engagementTypes.length > 0) {
        const filter = {
            bool: {
                should: [],
            },
        };
        engagementTypes.forEach((engagementType) => {
            filter.bool.should.push({
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
function filterNestedFacets(parents, children, parentKey, childKey, nestedField = undefined) {
    let allMusts = [];
    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            let must = [
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

    const queryObject = {
        bool: {
            should: allMusts.map((must) => ({
                bool: {
                    must,
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
};

// Filtrer på alle type locations (land, kommune, fylke, internasjonalt)
function filterLocation(counties, municipals, countries, international = false) {
    const filter = {
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
        const countiesComputed = [];

        counties.forEach((c) => {
            countiesComputed.push({
                key: c,
                municipals: Array.isArray(municipals) ? municipals.filter((m) => m.split(".")[0] === c) : [],
            });
        });

        countiesComputed.forEach((c) => {
            const must = [
                {
                    term: {
                        "locationList.county.keyword": c.key,
                    },
                },
            ];

            if (c.municipals.length > 0) {
                let mustObject = {
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
                    const municipal = m.split(".")[1];
                    if (municipal in specialMunicipals) {
                        mustObject.bool.should.push({
                            terms: {
                                "locationList.municipal.keyword": [municipal, ...specialMunicipals[municipal]],
                            },
                        });
                    } else {
                        mustObject.bool.should.push({
                            term: {
                                "locationList.municipal.keyword": municipal,
                            },
                        });
                    }
                });

                must.push(mustObject);
            }

            filter.nested.query.bool.should.push({
                bool: {
                    must,
                },
            });
        });
    }

    const internationalObject = {
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
        filter.nested.query.bool.should.push(internationalObject);
    }

    return filter;
}

function filterOccupation(occupationFirstLevels, occupationSecondLevels = []) {
    return filterNestedFacets(
        occupationFirstLevels,
        occupationSecondLevels,
        "occupationList.level1",
        "occupationList.level2",
        "occupationList",
    );
}

function filterSector(sector) {
    const filters = [];
    if (sector && sector.length > 0) {
        const filter = {
            bool: {
                should: [],
            },
        };
        sector.forEach((item) => {
            filter.bool.should.push({
                term: {
                    sector_facet: item,
                },
            });
        });
        filters.push(filter);
    }
    return filters;
}

/* Experimental alternative relevance model with AND-logic and using cross-fields matching. */
function mainQueryConjunctionTuning(q, searchFields) {
    let matchFields;

    if (searchFields === "occupation") {
        matchFields = ["category_name_no^2", "title_no^1", "searchtags_no^0.3"];
    } else {
        matchFields = [
            "category_name_no^2",
            "title_no^1",
            "keywords_no^0.8",
            "searchtags_no^0.3",
            "geography_all_no^0.2",
            "adtext_no^0.2",
            "employerdescription_no^0.1",
        ];
    }
    return {
        bool: {
            must: {
                bool: {
                    should: [
                        {
                            multi_match: {
                                query: q,
                                type: "cross_fields",
                                fields: matchFields,
                                operator: "and",
                                tie_breaker: 0.3,
                                analyzer: "norwegian",
                                zero_terms_query: "all",
                            },
                        },
                        {
                            match_phrase: {
                                employername: {
                                    query: q,
                                    slop: 0,
                                    boost: 2,
                                },
                            },
                        },
                        {
                            match: {
                                id: {
                                    query: q,
                                    operator: "and",
                                    boost: 1,
                                },
                            },
                        },
                    ],
                },
            },
            should: [
                {
                    match_phrase: {
                        title: {
                            query: q,
                            slop: 2,
                        },
                    },
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                "location.municipal": {
                                    query: q,
                                },
                            },
                        },
                        boost: 3,
                    },
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                "location.county": {
                                    query: q,
                                },
                            },
                        },
                        boost: 3,
                    },
                },
            ],
            filter: {
                term: {
                    status: "ACTIVE",
                },
            },
        },
    };
}

/* Generate main matching query object with classic/original OR match relevance model */
function mainQueryDisjunctionTuning(q) {
    return {
        bool: {
            must: {
                multi_match: {
                    query: q,
                    type: "best_fields",
                    fields: [
                        "category_no^2",
                        "title_no^1",
                        "keywords_no^0.8",
                        "id^1",
                        "employername^0.9",
                        "searchtags_no^0.4",
                        "geography_all_no^0.2",
                        "adtext_no^0.2",
                        "employerdescription_no^0.1",
                    ],
                    tie_breaker: 0.3,
                    minimum_should_match: 1,
                    zero_terms_query: "all",
                },
            },
            should: [
                {
                    match_phrase: {
                        title: {
                            query: q,
                            slop: 2,
                        },
                    },
                },
                {
                    match_phrase: {
                        employername: {
                            query: q,
                            slop: 0,
                            boost: 1,
                        },
                    },
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                "location.municipal": {
                                    query: q,
                                },
                            },
                        },
                        boost: 3,
                    },
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                "location.county": {
                                    query: q,
                                },
                            },
                        },
                        boost: 3,
                    },
                },
            ],
            filter: {
                term: {
                    status: "ACTIVE",
                },
            },
        },
    };
}

const elasticSearchRequestBody = (query) => {
    const {
        from,
        size,
        counties,
        countries,
        municipals,
        extent,
        workLanguage,
        remote,
        engagementType,
        sector,
        published,
        occupationFirstLevels,
        occupationSecondLevels,
        international,
        fields,
        operator,
    } = query;
    let { sort, q } = query;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.trim().length === 0) {
        if (sort !== "expires") {
            sort = "published";
        }
        q = "";
    }
    // Resolve if and-operator should be used (experimental)
    let mainQueryTemplateFunc = mainQueryConjunctionTuning;
    if (operator === "or") {
        mainQueryTemplateFunc = mainQueryDisjunctionTuning;
    }

    let template = {
        from: from || 0,
        size: size || 50,
        track_total_hits: true,
        query: mainQueryTemplateFunc(q, fields),
        post_filter: {
            bool: {
                filter: [
                    ...filterExtent(extent),
                    ...filterWorkLanguage(workLanguage),
                    ...filterRemote(remote),
                    filterLocation(counties, municipals, countries, international),
                    filterOccupation(occupationFirstLevels, occupationSecondLevels),
                    ...filterEngagementType(engagementType),
                    ...filterSector(sector),
                    ...filterPublished(published),
                ],
            },
        },
        _source: {
            includes: [
                "employer.name",
                "businessName",
                "properties.employer",
                "properties.jobtitle",
                "properties.location",
                "properties.applicationdue",
                "properties.hasInterestform",
                "properties.workLanguage",
                "locationList",
                "title",
                "published",
                "expires",
                "uuid",
                "status",
                "source",
                "medium",
                "reference",
                "categoryList",
                "properties.keywords",
                "properties.searchtags",
                "occupationList",
            ],
        },
        aggs: {
            positioncount: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
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
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
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
                            ],
                        },
                    },
                },
            },
            sector: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterPublished(published),
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
                        terms: { field: "extent_facet" },
                    },
                },
            },
            workLanguage: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            ...filterRemote(remote),
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
                        terms: { field: "worklanguage_facet", missing: NOT_DEFINED },
                    },
                },
            },
            engagementType: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterSector(sector),
                            ...filterPublished(published),
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
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
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
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterLocation(counties, municipals, countries, international),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
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
                            ...filterExtent(extent),
                            ...filterWorkLanguage(workLanguage),
                            ...filterRemote(remote),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published),
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

    if (useRemoteFilter) {
        template.aggs = {
            ...template.aggs,
            remote: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
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
                        filters: {
                            other_bucket_key: "ikke-hjemmekontor",
                            filters: {
                                hjemmekontor: {
                                    bool: {
                                        should: [
                                            {
                                                term: {
                                                    "properties.remote": "Hjemmekontor",
                                                },
                                            },
                                            {
                                                term: {
                                                    "properties.remote": "Hybridkontor",
                                                },
                                            },
                                            {
                                                match: {
                                                    adtext_no: "hjemmekontor",
                                                },
                                            },
                                        ],
                                    },
                                },
                            },
                        },
                    },
                },
            },
        };
    }

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
            ],
        };
    }

    return template;
};

export default elasticSearchRequestBody;
