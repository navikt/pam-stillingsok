const ExpiresRange = {
    TODAY: { key: 'now/d+1d', label: '1d' },
    NEXT_3_DAYS: { key: 'now/d+3d', label: '3d' },
    NEXT_7_DAYS: { key: 'now/d+1w', label: '1w' },
    NEXT_14_DAYS: { key: 'now/d+2w', label: '2w' },
    NEXT_MONTH: { key: 'now/d+1M', label: '1m' }
};

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

export function filterExpires(expires) {
    const filters = {
        bool: {
            should: []
        }
    };

    const found = Object.keys(ExpiresRange).find((key) => ExpiresRange[key].label === expires);
    if (found) {
        const expiresKey = ExpiresRange[found].key;
        filters.bool.should.push({
            range: {
                expires: {
                    gte: 'now/d',
                    lt: expiresKey,
                    time_zone: 'CET'
                }
            }
        });
    }
    return filters;
}

export default function searchTemplate(query) {
    const {
        from, size, counties, municipals, extent, engagementType, sector, published, expires
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
        from,
        size,
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
                    filterEngagementType(engagementType),
                    filterSector(sector),
                    filterPublished(published),
                    filterExpires(expires)
                ]
            }
        },
        _source: {
            includes: [
                'properties.employer',
                'properties.jobtitle',
                'properties.location',
                'properties.applicationdue',
                'expires',
                'title',
                'updated',
                'uuid'
            ]
        },
        aggs: {
            expires: {
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
                            filterPublished(published),
                            filterSector(sector)
                        ]
                    }
                },
                aggs: {
                    range: {
                        date_range: {
                            field: 'expires',
                            time_zone: 'CET',
                            ranges: [
                                {
                                    key: ExpiresRange.TODAY.label,
                                    from: 'now/d',
                                    to: 'now/d+1d'
                                },
                                {
                                    key: ExpiresRange.NEXT_3_DAYS.label,
                                    from: 'now/d',
                                    to: 'now/d+3d'
                                },
                                {
                                    key: ExpiresRange.NEXT_7_DAYS.label,
                                    from: 'now/d',
                                    to: 'now/d+1w'
                                },
                                {
                                    key: ExpiresRange.NEXT_14_DAYS.label,
                                    from: 'now/d',
                                    to: 'now/d+2w'
                                },
                                {
                                    key: ExpiresRange.NEXT_MONTH.label,
                                    from: 'now/d',
                                    to: 'now/d+1M'
                                }
                            ]
                        }
                    }
                }
            },
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
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterExpires(expires)
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
                            filterEngagementType(engagementType),
                            filterPublished(published),
                            filterExpires(expires)
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
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterPublished(published),
                            filterExpires(expires)
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
                            filterSector(sector),
                            filterPublished(published),
                            filterExpires(expires)
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
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterPublished(published),
                            filterExpires(expires)
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
            }
        }
    };

    if (sort && sort !== 'relevant') {
        template = {
            ...template,
            sort: [
                {
                    [sort]: {
                        order: mapSortByOrder(sort)
                    }
                },
                '_score'
            ]
        };
    }

    return template;
}
