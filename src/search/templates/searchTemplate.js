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

export function filterHeltidDeltid(heltidDeltid) {
    const filters = [];
    if (heltidDeltid && heltidDeltid.length > 0) {
        const filter = {
            bool: {
                should: []
            }
        };
        heltidDeltid.forEach((item) => {
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

export function filterCreated(created) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (created && created.length > 0) {
        filters.bool.should.push({
            range: {
                created: {
                    gte: 'now-1d'
                }
            }
        });
    }
    return filters;
}

export default function searchTemplate(query) {
    const { from, counties, municipals, heltidDeltid, engagementType, sector, created } = query;
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
        size: 20,
        query: {
            bool: {
                must: {
                    multi_match: {
                        query: q,
                        fields: [
                            'title_no^2',
                            'category_no^2',
                            'searchtags_no^0.3',
                            'adtext_no^0.2',
                            'employer.name^0.1',
                            'employerdescription_no^0.1'
                        ],
                        tie_breaker: 0.1,
                        zero_terms_query: 'all'
                    }
                },
                should: {
                    match_phrase: {
                        title: {
                            query: q,
                            slop: 3
                        }
                    }
                }
            },
        },
        post_filter: {
            bool: {
                filter: [
                    {
                        term: {
                            status: 'ACTIVE'
                        }
                    },
                    ...filterHeltidDeltid(heltidDeltid),
                    filterLocation(counties, municipals),
                    filterEngagementType(engagementType),
                    filterSector(sector),
                    filterCreated(created)
                ]
            }
        },
        _source: {
            includes: [
                "properties.employer",
                "properties.jobtitle",
                "properties.location",
                "title",
                "updated",
                "uuid"
            ]
        },
        aggs: {
            created: {
                filter: {
                    bool: {
                        filter: [
                            {
                                term: {
                                    status: 'ACTIVE'
                                }
                            },
                            ...filterHeltidDeltid(heltidDeltid),
                            filterLocation(counties, municipals),
                            filterEngagementType(engagementType),
                            filterSector(sector)
                        ]
                    }
                },
                aggs: {
                    range: {
                        date_range: {
                            field: 'created',
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
                            ...filterHeltidDeltid(heltidDeltid),
                            filterLocation(counties, municipals),
                            filterEngagementType(engagementType),
                            filterCreated(created)
                        ]
                    }
                },
                aggs: {
                    values: {
                        terms: {field: 'sector_facet'}
                    }
                }
            },
            heltidDeltid: {
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
                            filterCreated(created)
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
                            ...filterHeltidDeltid(heltidDeltid),
                            filterLocation(counties, municipals),
                            filterSector(sector),
                            filterCreated(created)
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
                            ...filterHeltidDeltid(heltidDeltid),
                            filterEngagementType(engagementType),
                            filterSector(sector),
                            filterCreated(created)
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
