import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { Locations } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_utils/constants";
import { SOMMERJOBB_CATEGORIES, SOMMERJOBB_KEYWORDS } from "@/app/sommerjobb/_utils/searchKeywords";

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
    | "_score";

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

function baseFreeTextSearchMatch(queries: readonly string[], fields: string[]) {
    return {
        multi_match: {
            query: queries.join(" ").trim(),
            type: "cross_fields",
            fields: fields,
            operator: "or",
            tie_breaker: 0.3,
            analyzer: "norwegian_custom",
            zero_terms_query: "all",
        },
    };
}

const elasticSearchRequestBody = (query: ExtendedQuery) => {
    const { from, withinDrivingDistance } = query;
    let { q } = query;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.length === 0) {
        q = [""];
    }

    const sommerjobbScoringProfile = [
        "category_name_no^2",
        "title_no^2",
        "keywords_no^2",
        "searchtagsai_no^2",
        "searchtags_no^2",
        "adtext_no^0.1",
    ];

    const sommerjobbCategoryScoringProfile = ["searchtagsai_no"];

    const showMissing = q.length === 1 && q[0] === "missing";

    const template: OpenSearchRequestBody = {
        explain: true,
        from: from || 0,
        size: SOMMERJOBB_SEARCH_RESULT_SIZE,
        track_total_hits: true,
        query: {
            bool: {
                [showMissing ? "must_not" : "must"]: showMissing
                    ? baseFreeTextSearchMatch(
                          SOMMERJOBB_CATEGORIES.map((it) => it.values).flat(),
                          sommerjobbCategoryScoringProfile,
                      )
                    : baseFreeTextSearchMatch(q, sommerjobbCategoryScoringProfile),
                filter: [
                    {
                        bool: {
                            should: baseFreeTextSearchMatch(SOMMERJOBB_KEYWORDS, sommerjobbScoringProfile),
                        },
                    },
                    {
                        term: {
                            status: "ACTIVE",
                        },
                    },
                ],
            },
        },
        post_filter: {
            bool: {
                filter: [filterWithinDrivingDistance(withinDrivingDistance)],
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
                "categoryList.id",
                "categoryList.name",
                "categoryList.categoryType",
                "properties.keywords",
                "properties.adtext",
                "properties.searchtagsai",
                "properties.searchtags.label",
                "properties.searchtags.score",
                "occupationList.level1",
                "occupationList.level2",
            ],
        },
    };

    return template;
};

export default elasticSearchRequestBody;
