import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { Locations } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";
import { SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb-test/_utils/constants";
import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb-test/_utils/searchKeywords";

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

const elasticSearchRequestBody = (query: ExtendedQuery) => {
    const { from, size, withinDrivingDistance } = query;
    let { q } = query;

    const template: OpenSearchRequestBody = {
        from: from || 0,
        size: size || SOMMERJOBB_SEARCH_RESULT_SIZE,
        track_total_hits: true,
        sort: [{ published: { order: "desc" } }],
        query: {
            bool: {
                filter: [
                    {
                        term: {
                            "generatedSearchMetadata.isSummerJob": true,
                        },
                    },
                    {
                        term: {
                            status: "ACTIVE",
                        },
                    },
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
                "properties.adtext",
                "properties.searchtagsai",
                "properties.searchtags.label",
                "properties.searchtags.score",
                "occupationList.level1",
                "occupationList.level2",
                "generatedSearchMetadata.properties.isSummerJob",
                "generatedSearchMetadata.properties.summerJobConfidence",
                "generatedSearchMetadata.properties.summerJobReason",
            ],
        },
    };

    if (q && Array.isArray(q)) {
        const allCategories = SOMMERJOBB_CATEGORIES.map((it) => it.values).flat();

        const showAndre = q.includes("showMissing");
        if (showAndre) {
            q = q.filter((it) => it !== "showMissing");
        }

        if (q.length > 0 && !showAndre) {
            // @ts-expect-error fiks senere
            template.query.bool.filter.push({
                terms: {
                    searchtagsai_facet: q,
                },
            });
        } else if (q.length === 0 && showAndre) {
            // @ts-expect-error fiks senere
            template.query.bool.filter.push({
                bool: {
                    must_not: {
                        terms: {
                            searchtagsai_facet: allCategories,
                        },
                    },
                },
            });
        } else if (q.length > 0 && showAndre) {
            // @ts-expect-error fiks senere
            template.query.bool.filter.push({
                bool: {
                    should: [
                        {
                            terms: {
                                searchtagsai_facet: q,
                            },
                        },
                        {
                            bool: {
                                must_not: [
                                    {
                                        terms: {
                                            searchtagsai_facet: allCategories,
                                        },
                                    },
                                ],
                            },
                        },
                    ],
                },
            });
        }
    }

    return template;
};

export default elasticSearchRequestBody;
