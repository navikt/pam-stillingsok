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

export function filterSektor(sektor) {
    const filters = {
        bool: {
            should: []
        }
    };
    if (sektor && sektor.length > 0) {
        sektor.forEach((item) => {
            filters.bool.should.push({
                term: {
                    sector_facet: item
                }
            });
        });
    }
    return filters;
}

export default function searchTemplate(query) {
    const { from, counties, municipals, heltidDeltid, engagementType, sektor } = query;
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
                    filterSektor(sektor)
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
            sektor: {
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
                            filterEngagementType(engagementType)
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
                            filterSektor(sektor)
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
                            filterSektor(sektor)
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
                            filterSektor(sektor)
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
