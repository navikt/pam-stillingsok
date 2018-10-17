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

export function filterLocation(counties, municipals) {
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

export function filterOccupation(occupationFirstLevels, occupationSecondLevels) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (occupationFirstLevels && occupationFirstLevels.length > 0) {
        occupationFirstLevels.forEach((occupationFirstLevel) => {
            filters.bool.should.push({
                term: {
                    occupation_level1_facet: occupationFirstLevel
                }
            });
        });
    }

    if (occupationSecondLevels && occupationSecondLevels.length > 0) {
        occupationSecondLevels.forEach((occupationSecondLevel) => {
            filters.bool.should.push({
                term: {
                    occupation_level2_facet: occupationSecondLevel
                }
            });
        });
    }

    return filters;
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

export default function searchTemplate(query) {
    const {
        from, size, counties, municipals, extent, engagementType, sector, published,
        occupationFirstLevels, occupationSecondLevels
    } = query;
    let { sort, q } = query;

    /**
     *  To ensure consistent search results across multiple shards in elasticsearch when query is blank
     */
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
