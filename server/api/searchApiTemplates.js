function mapSortByValue(value) {
    switch (value) {
        case 'expires':
            return 'expires';
        case 'published':
        default:
            return 'published';
    }
}

function mapSortByOrder(value) {
    if (value !== 'published') {
        return 'asc';
    }
    return 'desc';
}

function filterPublished(published) {
    const filters = [];
    if (published) {
        filters.push({
            range: {
                published: {
                    gte: published,
                    time_zone: 'CET'
                }
            }
        });
    }
    return filters;
}

function suggest(field, match, minLength) {
    return {
        prefix: match,
        completion: {
            field,
            skip_duplicates: true,
            contexts: {
                status: 'ACTIVE'
            },
            size: 5,
            fuzzy: {
                prefix_length: minLength
            }
        }
    };
}

function filterExtent(extent) {
    const filters = [];
    if (extent && extent.length > 0) {
        const filter = {
            bool: {
                should: []
            }
        };
        extent.forEach((item) => {
            filter.bool.should.push({
                term: {
                    extent_facet: item
                }
            });
        });
        filters.push(filter);
    }
    return filters;
}

function filterEngagementType(engagementTypes) {
    const filters = [];
    if (engagementTypes && engagementTypes.length > 0) {
        const filter = {
            bool: {
                should: []
            }
        };
        engagementTypes.forEach((engagementType) => {
            filter.bool.should.push({
                term: {
                    engagementtype_facet: engagementType
                }
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
function filterNestedFacets(parents, children = [], parentKey, childKey, nestedField = undefined) {
    let allMusts = [];
    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            let must = [{
                term: {
                    [parentKey]: parent
                }
            }];

            const childrenOfCurrentParent = children.filter((m) => (m.split('.')[0] === parent));
            if (childrenOfCurrentParent.length > 0) {
                must = [...must, {
                    bool: {
                        should: childrenOfCurrentParent.map((child) => ({
                            term: {
                                [childKey]: child.split('.')[1] // child kan feks være AKERSHUS.ASKER
                            }
                        }))
                    }
                }];
            }

            allMusts = [...allMusts, must];
        });
    }

    const queryObject = {
        bool: {
            should: allMusts.map((must) => ({
                bool: {
                    must
                }
            }))
        }
    };

    return nestedField ? {
        nested: {
            path: nestedField,
            query: queryObject
        }
    } : queryObject;

}

// Filtrer på alle type locations (land, kommune, fylke, internasjonalt)
function filterLocation(counties, municipals, countries, international = false) {
    const filter = {
        nested: {
            path: 'locationList',
            query: {
                bool: {
                    should: []
                }
            }
        }
    };

    if (international) {
        filter.nested.query.bool.should.push({
            bool: {
                must_not: {
                    term: {
                        "locationList.country.keyword": "NORGE"
                    }
                }
            }
        });
    }

    addLocationsToFilter(countries, filter, 'country');
    addLocationsToFilter(counties, filter, 'county');
    addLocationsToFilter(municipals, filter, 'municipal');

    return filter;
}

function addLocationsToFilter(locations, filter, type) {
    if (Array.isArray(locations)) {
        locations.forEach(l => {
            const term = {};
            term[`locationList.${type}.keyword`] = type === 'municipal' ? l.split('.')[1] : l;

            filter.nested.query.bool.should.push({
                term
            });
        });
    }
}

function filterOccupation(occupationFirstLevels, occupationSecondLevels) {
    return filterNestedFacets(occupationFirstLevels, occupationSecondLevels,
        'occupationList.level1', 'occupationList.level2', 'occupationList');
}

function filterSector(sector) {
    const filters = [];
    if (sector && sector.length > 0) {
        const filter = {
            bool: {
                should: []
            }
        };
        sector.forEach((item) => {
            filter.bool.should.push({
                term: {
                    sector_facet: item
                }
            });
        });
        filters.push(filter);
    }
    return filters;
}

exports.suggestionsTemplate = (match, minLength) => ({
    suggest: {
        category_suggest: {
            ...suggest('category_suggest', match, minLength)
        },
        searchtags_suggest: {
            ...suggest('searchtags_suggest', match, minLength)
        }
    },
    _source: false
});

/* Experimental alternative relevance model with AND-logic and using cross-fields matching. */
function mainQueryConjunctionTuning(q) {
    return {
        bool: {
            must: {
                bool: {
                    should: [
                        {
                            multi_match: {
                                query: q,
                                type: 'cross_fields',
                                fields: [
                                    'category_no^2',
                                    'title_no^1',
                                    'searchtags_no^0.3',
                                    'geography_all_no^0.2',
                                    'adtext_no^0.2',
                                    'employerdescription_no^0.1'
                                ],
                                operator: 'and',
                                tie_breaker: 0.3,
                                analyzer: 'norwegian',
                                zero_terms_query: 'all'
                            }
                        },
                        {
                            match_phrase: {
                                'employername': {
                                    query: q,
                                    slop: 0,
                                    boost: 2
                                }
                            }
                        },
                        {
                            match: {
                                id: {
                                    query: q,
                                    operator: 'and',
                                    boost: 1
                                }
                            }
                        }
                    ]
                }
            },
            should: [
                {
                    match_phrase: {
                        title: {
                            query: q,
                            slop: 2
                        }
                    }
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                'location.municipal': {
                                    query: q
                                }
                            }
                        },
                        boost: 3
                    }
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                'location.county': {
                                    query: q
                                }
                            }
                        },
                        boost: 3
                    }
                }
            ],
            filter: {
                term: {
                    status: 'ACTIVE'
                }
            }
        }
    }
}

/* Generate main matching query object with classic/original OR match relevance model */
function mainQueryDisjunctionTuning(q) {
    return {
        bool: {
            must: {
                multi_match: {
                    query: q,
                    type: 'best_fields',
                    fields: [
                        'category_no^2',
                        'title_no^1',
                        'id^1',
                        'employername^0.9',
                        'searchtags_no^0.4',
                        'geography_all_no^0.2',
                        'adtext_no^0.2',
                        'employerdescription_no^0.1'
                    ],
                    tie_breaker: 0.3,
                    minimum_should_match: 1,
                    zero_terms_query: 'all'
                }
            },
            should: [
                {
                    match_phrase: {
                        title: {
                            query: q,
                            slop: 2
                        }
                    }
                },
                {
                    match_phrase: {
                        'employername': {
                            query: q,
                            slop: 0,
                            boost: 1
                        }
                    }
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                'location.municipal': {
                                    query: q
                                }
                            }
                        },
                        boost: 3
                    }
                },
                {
                    constant_score: {
                        filter: {
                            match: {
                                'location.county': {
                                    query: q
                                }
                            }
                        },
                        boost: 3
                    }
                }
            ],
            filter: {
                term: {
                    status: 'ACTIVE'
                }
            }
        }
    }
}

exports.searchTemplate = (query) => {
    const {
        from, size, counties, countries, municipals, extent, engagementType, sector, published,
        occupationFirstLevels, occupationSecondLevels, international
    } = query;
    let {sort, q, operator} = query;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.trim().length === 0) {
        if (sort !== 'expires') {
            sort = 'published';
        }
        q = '';
    }

    // Resolve if and-operator should be used (experimental)
    let mainQueryTemplateFunc = mainQueryConjunctionTuning;
    if (operator === 'or') {
        mainQueryTemplateFunc = mainQueryDisjunctionTuning;
    }

    let template = {
        from: from || 0,
        size: size || 50,
        track_total_hits: true,
        query: mainQueryTemplateFunc(q),
        post_filter: {
            bool: {
                filter: [
                    ...filterExtent(extent),
                    filterLocation(counties, municipals, countries, international),
                    filterOccupation(occupationFirstLevels, occupationSecondLevels),
                    ...filterEngagementType(engagementType),
                    ...filterSector(sector),
                    ...filterPublished(published),
                ]
            }
        },
        _source: {
            includes: [
                'employer.name',
                'businessName',
                'properties.employer',
                'properties.jobtitle',
                'properties.location',
                'properties.applicationdue',
                'locationList',
                'title',
                'published',
                'expires',
                'uuid',
                'status',
                'source',
                'reference'
            ]
        },
        aggs: {
            positioncount: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    sum: {
                        sum: {
                            field: 'properties.positioncount',
                            missing: 1
                        }
                    }
                }
            },
            published: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector)
                        ]
                    }
                },
                aggs: {
                    range: {
                        date_range: {
                            field: 'published',
                            time_zone: 'CET',
                            ranges: [
                                {
                                    key: 'now/d',
                                    from: 'now/d'
                                }
                            ]
                        }
                    }
                }
            },
            sector: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: {field: 'sector_facet'}
                    }
                }
            },
            extent: {
                filter: {
                    bool: {
                        filter: [
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: {field: 'extent_facet'}
                    }
                }
            },
            engagementType: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterLocation(counties, municipals, countries, international),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterSector(sector),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: {field: 'engagementtype_facet'}
                    }
                }
            },
            counties: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    nestedLocations: {
                        nested: {
                            path: 'locationList',
                        },
                        aggs: {
                            values: {
                                terms: {
                                    field: 'locationList.county.keyword',
                                    size: 50,
                                    order: {
                                        _key: 'asc'
                                    }
                                },
                                aggs: {
                                    root_doc_count: {
                                        reverse_nested: {}
                                    },
                                    municipals: {
                                        terms: {
                                            field: 'locationList.municipal.keyword',
                                            size: 200,
                                            order: {
                                                _key: 'asc'
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            occupations: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterLocation(counties, municipals, countries, international),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    nestedOccupations: {
                        nested: {
                            path: 'occupationList',
                        },
                        aggs: {
                            occupationFirstLevels: {
                                terms: {
                                    field: 'occupationList.level1',
                                    size: 50
                                },
                                aggs: {
                                    root_doc_count: {
                                        reverse_nested: {}
                                    },
                                    occupationSecondLevels: {
                                        terms: {
                                            field: 'occupationList.level2',
                                            size: 100
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            },
            countries: {
                filter: {
                    bool: {
                        filter: [
                            ...filterExtent(extent),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            ...filterEngagementType(engagementType),
                            ...filterSector(sector),
                            ...filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    nestedLocations: {
                        nested: {
                            path: 'locationList',
                        },
                        aggs: {
                            values: {
                                terms: {
                                    field: 'locationList.country.keyword',
                                    exclude: "NORGE",
                                    size: 50,
                                    order: {
                                        _key: 'asc'
                                    }
                                },
                                aggs: {
                                    root_doc_count: {
                                        reverse_nested: {}
                                    },
                                }
                            }
                        }
                    }
                }
            },
        }
    };

    if (sort && sort !== 'relevant') {
        template = {
            ...template,
            sort: [
                {
                    [mapSortByValue(sort)]: {
                        order: mapSortByOrder(sort)
                    }
                },
                '_score'
            ]
        };
    }

    return template;
};
