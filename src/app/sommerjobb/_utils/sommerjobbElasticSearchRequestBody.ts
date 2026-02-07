import { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_utils/constants";
import { SOMMERJOBB_CATEGORIES } from "@/app/sommerjobb/_utils/searchKeywords";
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

const COUNTY_FIELD = "locationList.county.keyword";
const MUNICIPAL_FIELD = "locationList.municipal.keyword";

type ParsedMunicipalKey = {
    readonly county: string;
    readonly municipal: string;
};

const parseMunicipalKey = (municipalKey: string): ParsedMunicipalKey => {
    const trimmed = municipalKey.trim();

    // forventer "FYLKE.KOMMUNE"
    const parts = trimmed.split(".", 2);
    const county = parts[0] ?? "";
    const municipal = parts[1] ?? "";

    return { county, municipal };
};

export function buildLocationFilter(countyKey?: string, municipalKey?: string): EsClause | null {
    const county = countyKey?.trim() ?? "";
    const municipalRaw = municipalKey?.trim() ?? "";

    if (county.length === 0 && municipalRaw.length === 0) {
        return null;
    }

    // Kommune valgt: bygg samme struktur som hovedsøket (county + municipal i samme nested).
    if (municipalRaw.length > 0) {
        const parsed = parseMunicipalKey(municipalRaw);

        const derivedCounty = parsed.county;
        const municipalName = parsed.municipal;

        // Hvis du allerede har county fra query, bruk den – ellers bruk derived.
        const finalCounty = county.length > 0 ? county : derivedCounty;

        return {
            nested: {
                path: "locationList",
                query: {
                    bool: {
                        filter: [
                            { term: { [COUNTY_FIELD]: finalCounty } },
                            { term: { [MUNICIPAL_FIELD]: municipalName } },
                        ],
                    },
                },
            },
        };
    }

    // Kun fylke valgt
    return {
        nested: {
            path: "locationList",
            query: {
                term: { [COUNTY_FIELD]: county },
            },
        },
    };
}

const elasticSearchRequestBody = (query: ExtendedQuery): OpenSearchRequestBody => {
    const { from, size, municipal, county } = query;
    let { q } = query;

    const filters: EsClause[] = [
        {
            term: {
                "generatedSearchMetadata.summerJobMetadata.isSummerJob": true,
            },
        },
        {
            term: {
                status: "ACTIVE",
            },
        },
    ];

    const locationFilter = buildLocationFilter(county, municipal);
    if (locationFilter) {
        filters.push(locationFilter);
    }

    const template: OpenSearchRequestBody = {
        from: from || 0,
        size: size || SOMMERJOBB_SEARCH_RESULT_SIZE,
        track_total_hits: true,
        sort: [{ published: { order: "desc" } }],
        aggs: {
            positioncount: {
                filter: { match_all: {} },
                aggs: {
                    sum: {
                        sum: {
                            field: "properties.positioncount",
                            missing: 0,
                        },
                    },
                },
            },
        },
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
                "generatedSearchMetadata.summerJobMetadata.isSummerJob",
                "generatedSearchMetadata.summerJobMetadata.reason",
            ],
        },
    };

    if (q && Array.isArray(q)) {
        const allCategories = SOMMERJOBB_CATEGORIES.map((it) => it.values).flat();

        const showAndre = q.includes("showMissing");
        if (showAndre) {
            q = q.filter((it) => {
                return it !== "showMissing";
            });
        }

        if (q.length > 0 && !showAndre) {
            filters.push({
                terms: {
                    searchtagsai_facet: q,
                },
            });
        } else if (q.length === 0 && showAndre) {
            filters.push({
                bool: {
                    must_not: [
                        {
                            terms: {
                                searchtagsai_facet: allCategories,
                            },
                        },
                    ],
                },
            });
        } else if (q.length > 0 && showAndre) {
            filters.push({
                bool: {
                    should: [
                        { terms: { searchtagsai_facet: q } },
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
                    minimum_should_match: 1,
                },
            });
        }
    }

    return template;
};

export default elasticSearchRequestBody;
