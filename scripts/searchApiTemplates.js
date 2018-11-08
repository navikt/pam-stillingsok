<<<<<<< HEAD:scripts/searchApiTemplates.js
exports.suggestionsTemplate = (match, minLength) => ({
    suggest: {
        category_suggest: {
            ...suggest('category_suggest', match, minLength)
        },
        searchtags_suggest: {
            ...suggest('searchtags_suggest', match, minLength)
=======
function mapSortByValue(value) {
    switch (value) {
        case 'updated':
        default:
            return 'updated';
    }
}

function mapSortByOrder(value) {
    if (value !== 'updated') {
        return 'asc';
    }
    return 'desc';
}

export function filterExtent(extent) {
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

export function filterEngagementType(engagementTypes) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (engagementTypes && engagementTypes.length > 0) {
        engagementTypes.forEach((engagementType) => {
            filters.bool.should.push({
                term: {
                    engagementtype_facet: engagementType
                }
            });
        });
    }
    return filters;
}

/**
 * Lager filter for fasetter med flere nivå, feks fylke og kommune. Kobinerer AND og OR.
 * Feks (Akershus) OR (Buskerud) hvis man bare har valgt disse to fylkene.
 * Feks (Akershus AND Asker) OR (Buskerud AND Drammen) om man ser etter jobb i Asker og Drammen
 * Feks (Akershus) OR (Buskerud AND Drammen) om man ser etter jobb i hele Akershus fylke, men også i Drammen kommune.
 */
export function filterNestedFacets(parents, children = [], parentKey, childKey) {
    let allMusts = [];
    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            let must = [{
                match: {
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

    return {
        bool: {
            should: allMusts.map((must) => ({
                bool: {
                    must
                }
            }))
        }
    };
}

export function filterLocation(counties, municipals) {
    return filterNestedFacets(counties, municipals, 'county_facet', 'municipal_facet');
}

export function filterOccupation(occupationLevel1, occupationLevel2) {
    return filterNestedFacets(occupationLevel1, occupationLevel2, 'occupation_level1_facet', 'occupation_level2_facet');
}


export function filterSector(sector) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (sector && sector.length > 0) {
        sector.forEach((item) => {
            filters.bool.should.push({
                term: {
                    sector_facet: item
                }
            });
        });
    }
    return filters;
}

export function filterPublished(published) {
    const filters = {
        bool: {
            should: []
>>>>>>> pam-1360-fikser-elastic-search-query:src/api/templates/searchTemplate.js
        }
    },
    _source: false
});

exports.searchTemplate = (query) => {
    const {
        from, size, counties, municipals, extent, engagementType, sector, published,
        occupationFirstLevels, occupationSecondLevels
    } = query;
    let { sort, q } = query;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.trim().length === 0) {
        sort = 'updated';
        q = '';
    }

    let template = {
        from: from || 0,
        size: size || 50,
        query: {
            bool: {
                must: {
                    multi_match: {
                        query: q,
                        type: 'best_fields',
                        fields: [
                            'category_no^2',
                            'title_no^1',
                            'searchtags_no^0.4',
                            'adtext_no^0.2',
                            'employer.name^0.2',
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
                        constant_score: {
                            filter: {
                                match: {
                                    'location.municipal': {
                                        query: q,
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
                                        query: q,
                                    }
                                }
                            },
                            boost: 3
                        }
                    }
                ]
            }
        },
        post_filter: {
            bool: {
                filter: [
                    {
                        term: {
                            status: 'ACTIVE'
                        }
                    },
                    ...filterExtent(extent),
                    filterLocation(counties, municipals),
                    filterOccupation(occupationFirstLevels, occupationSecondLevels),
                    filterEngagementType(engagementType),
                    filterSector(sector),
                    filterPublished(published)
                ]
            }
        },
        _source: {
            includes: [
                'properties.employer',
                'properties.jobtitle',
                'properties.location',
                'properties.applicationdue',
                'applicationdue',
                'title',
                'updated',
                'uuid',
                'status'
            ]
        },
        aggs: {
            published: {
                filter: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            ...filterExtent(extent),
                            filterLocation(counties, municipals),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            filterEngagementType(engagementType),
                            filterSector(sector)
                        ]
                    }
                },
                aggs: {
                    range: {
                        date_range: {
                            field: 'published',
                            ranges: [
                                {
                                    key: 'now-1d',
                                    from: 'now-1d'
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
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            ...filterExtent(extent),
                            filterLocation(counties, municipals),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            filterEngagementType(engagementType),
                            filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: { field: 'sector_facet' }
                    }
                }
            },
            extent: {
                filter: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            filterLocation(counties, municipals),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: { field: 'extent_facet' }
                    }
                }
            },
            engagementType: {
                filter: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            ...filterExtent(extent),
                            filterLocation(counties, municipals),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            filterSector(sector),
                            filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: { field: 'engagementtype_facet' }
                    }
                }
            },
            counties: {
                filter: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            ...filterExtent(extent),
                            filterOccupation(occupationFirstLevels, occupationSecondLevels),
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: {
                            field: 'county_facet',
                            size: 20,
                            order: {
                                _key: 'asc'
                            }
                        },
                        aggs: {
                            municipals: {
                                terms: {
                                    field: 'municipal_facet',
                                    size: 100,
                                    order: {
                                        _key: 'asc'
                                    }
                                }
                            }
                        }
                    }
                }
            },
            occupationFirstLevels: {
                filter: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            ...filterExtent(extent),
                            filterLocation(counties, municipals),
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterPublished(published)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: {
                            field: 'occupation_level1_facet'
                        },
                        aggs: {
                            occupationSecondLevels: {
                                terms: {
                                    field: 'occupation_level2_facet'
                                }
                            }
                        }
                    }
                }
            }
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
}

function mapSortByValue(value) {
    switch (value) {
        case 'updated':
        default:
            return 'updated';
    }
}

function mapSortByOrder(value) {
    if (value !== 'updated') {
        return 'asc';
    }
    return 'desc';
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
    const filters = {
        bool: {
            should: []
        }
    };
    if (engagementTypes && engagementTypes.length > 0) {
        engagementTypes.forEach((engagementType) => {
            filters.bool.should.push({
                term: {
                    engagementtype_facet: engagementType
                }
            });
        });
    }
    return filters;
}

function filterLocation(counties, municipals) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (counties && counties.length > 0) {
        counties.forEach((county) => {
            filters.bool.should.push({
                term: {
                    county_facet: county
                }
            });
        });
    }

    if (municipals && municipals.length > 0) {
        municipals.forEach((municipal) => {
            filters.bool.should.push({
                term: {
                    municipal_facet: municipal
                }
            });
        });
    }

    return filters;
}

function filterOccupation(occupationFirstLevels, occupationSecondLevels) {
    return filterNestedFacets(occupationLevel1, occupationLevel2, 'occupation_level1_facet', 'occupation_level2_facet');
}

function filterSector(sector) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (sector && sector.length > 0) {
        sector.forEach((item) => {
            filters.bool.should.push({
                term: {
                    sector_facet: item
                }
            });
        });
    }
    return filters;
}

function filterPublished(published) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (published && published.length > 0) {
        filters.bool.should.push({
            range: {
                published: {
                    gte: 'now-1d'
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

/**
 * Lager filter for fasetter med flere nivå, feks fylke og kommune. Kombinerer AND og OR.
 * Feks (Akershus) OR (Buskerud) hvis man bare har valgt disse to fylkene.
 * Feks (Akershus AND (Asker OR Bærum)) OR (Buskerud AND Drammen) om man ser etter jobb i Asker, Bærum eller Drammen
 * Feks (Akershus) OR (Buskerud AND Drammen) om man ser etter jobb i hele Akershus fylke, men også i Drammen kommune.
 */
export function filterNestedFacets(parents, children = [], parentKey, childKey) {
    let allMusts = [];
    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            let must = [{
                match: {
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

    return {
        bool: {
            should: allMusts.map((must) => ({
                bool: {
                    must
                }
            }))
        }
    };
}
