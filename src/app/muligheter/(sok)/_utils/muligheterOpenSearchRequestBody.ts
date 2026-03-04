import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_utils/constants";
import { parseMunicipalKey } from "@/app/_common/geografi/locationKeyParsing";
import { getNormalizedLocationFromQuery } from "@/app/_common/geografi/locationQueryParams";
type Primitive = string | number | boolean;

type EsTermClause = { readonly term: Record<string, Primitive> };
type EsTermsClause = { readonly terms: Record<string, readonly Primitive[]> };
type EsExistsClause = { readonly exists: { readonly field: string } };
type EsBoolClause = {
    readonly bool: {
        readonly must?: readonly EsClause[];
        readonly should?: readonly EsClause[];
        readonly must_not?: readonly EsClause[];
        readonly filter?: readonly EsClause[];
        readonly minimum_should_match?: number;
    };
};
type EsNestedClause = { readonly nested: { readonly path: string; readonly query: EsClause } };

type EsClause = EsTermClause | EsTermsClause | EsExistsClause | EsBoolClause | EsNestedClause;

type OpenSearchRequestBody = {
    readonly query?: EsClause;
    readonly sort?: readonly (
        | {
              readonly [field: string]: {
                  readonly order: "asc" | "desc";
              };
          }
        | "_score"
    )[];
    readonly from?: number;
    readonly size?: number;
    readonly track_total_hits?: boolean;
    readonly aggs?: Record<string, unknown>;
    readonly _source?: { readonly includes: readonly string[] };
} & Record<string, unknown>;

export const buildLocationFilter = (countyKey?: string | null, municipalKey?: string | null): EsClause | null => {
    const countyFromQuery = countyKey?.trim() ? countyKey.trim() : null;
    const municipalFromQuery = municipalKey?.trim() ? municipalKey.trim() : null;

    if (municipalFromQuery) {
        const parsed = parseMunicipalKey(municipalFromQuery);

        if (!parsed) {
            if (countyFromQuery) {
                return {
                    nested: {
                        path: "locationList",
                        query: {
                            term: {
                                "locationList.county.keyword": countyFromQuery,
                            },
                        },
                    },
                };
            }

            return null;
        }

        return {
            nested: {
                path: "locationList",
                query: {
                    bool: {
                        filter: [
                            { term: { "locationList.county.keyword": parsed.countyKey } },
                            { term: { "locationList.municipal.keyword": parsed.municipalKey } },
                        ],
                    },
                },
            },
        };
    }

    if (countyFromQuery) {
        return {
            nested: {
                path: "locationList",
                query: {
                    term: {
                        "locationList.county.keyword": countyFromQuery,
                    },
                },
            },
        };
    }

    return null;
};

const openSearchRequestBody = (query: ExtendedQuery): OpenSearchRequestBody => {
    const { from, size } = query;
    let { q } = query;

    const filters: EsClause[] = [
        {
            term: {
                source: "DIR",
            },
        },
        {
            term: {
                status: "ACTIVE",
            },
        },
    ];

    const { county, municipal } = getNormalizedLocationFromQuery(query);
    const locationFilter = buildLocationFilter(county, municipal);

    if (locationFilter) {
        filters.push(locationFilter);
    }

    if (q && Array.isArray(q)) {
        filters.push({
            nested: {
                path: "occupationList",
                query: {
                    bool: {
                        should: q.map((item) => ({
                            bool: { must: [{ term: { "occupationList.level1": item } }] },
                        })),
                    },
                },
            },
        });
    }

    const template: OpenSearchRequestBody = {
        from: from || 0,
        size: size || SOMMERJOBB_SEARCH_RESULT_SIZE,
        track_total_hits: true,
        sort: [{ published: { order: "desc" } }],
        query: {
            bool: {
                filter: filters,
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
                "properties.needDriversLicense",
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
                "properties.searchtags.label",
                "properties.searchtags.score",
                "occupationList.level1",
                "occupationList.level2",
            ],
        },
    };

    return template;
};

export default openSearchRequestBody;
