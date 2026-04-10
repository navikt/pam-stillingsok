import { ExtentEnum } from "@/app/stillinger/_common/utils/utils";
import { ALLOWED_NUMBER_OF_RESULTS_PER_PAGE, SEARCH_CHUNK_SIZE } from "./query";
import { type ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import { type Locations } from "@/app/stillinger/(sok)/_utils/fetchLocationsWithinDrivingDistance";

type Primitive = string | number | boolean;

type MatchQuery = Readonly<Record<string, unknown>>;

type RangeFilter = Readonly<{
    range: Readonly<Record<string, Readonly<Record<string, string | number>>>>;
}>;

type TermFilter = Readonly<{
    term: Readonly<Record<string, Primitive>>;
}>;

type TermsFilter = Readonly<{
    terms: Readonly<Record<string, readonly string[]>>;
}>;

type ExistsFilter = Readonly<{
    exists: Readonly<{
        field: string;
    }>;
}>;

type QueryClause = MatchQuery | RangeFilter | TermFilter | TermsFilter | ExistsFilter | BoolFilter | NestedFilter;

type BoolContainer = Readonly<{
    should?: QueryClause[];
    must?: QueryClause | readonly QueryClause[];
    must_not?: QueryClause | QueryClause[];
    filter?: QueryClause | readonly QueryClause[];
}> &
    Readonly<Record<string, unknown>>;

type BoolQuery = Readonly<{
    bool: BoolContainer;
}>;

type BoolFilter = BoolQuery & Readonly<Record<string, unknown>>;

export type NestedFilter = Readonly<{
    nested: Readonly<{
        path: string;
        query: BoolFilter;
    }>;
}>;

type Sort =
    | Readonly<{
          [field: string]: Readonly<{
              order: "asc" | "desc";
          }> &
              Readonly<Record<string, string | number | boolean>>;
      }>
    | "_score"
    | "_id";

type AggregationDefinition = Readonly<Record<string, unknown>>;

type Aggregations = Readonly<Record<string, AggregationDefinition>>;

// OpenSearch request body
export type OpenSearchRequestBody = Readonly<{
    query?: BoolFilter | MatchQuery | TermFilter;
    sort?: readonly Sort[];
    from?: number;
    size?: number;
    aggs?: Aggregations;
    _source?: Readonly<{
        includes: readonly string[];
    }>;
}> &
    Readonly<Record<string, unknown>>;

type FilterGroupKey =
    | "needDriversLicense"
    | "under18"
    | "experience"
    | "extent"
    | "education"
    | "workLanguage"
    | "remote"
    | "location"
    | "occupation"
    | "engagementType"
    | "sector"
    | "published"
    | "withinDrivingDistance";

type FilterGroups = Readonly<Record<FilterGroupKey, readonly QueryClause[]>>;

type BuildFiltersOptions = Readonly<{
    exclude?: readonly FilterGroupKey[];
    extra?: readonly QueryClause[];
}>;

const NOT_DEFINED = "Ikke oppgitt";

const FILTER_GROUP_ORDER: readonly FilterGroupKey[] = [
    "needDriversLicense",
    "under18",
    "experience",
    "extent",
    "education",
    "workLanguage",
    "remote",
    "location",
    "occupation",
    "engagementType",
    "sector",
    "published",
    "withinDrivingDistance",
] as const;

const SOURCE_INCLUDES: readonly string[] = [
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
    "properties.searchtagsai",
    "properties.searchtags.label",
    "properties.searchtags.score",
    "occupationList.level1",
    "occupationList.level2",
    /* For debugging under 18 */
    "under18_facet",
    "generatedSearchMetadata.isUnder18",
    "generatedSearchMetadata.isUnder18Reason",
    "generatedSearchMetadata.shortSummary",
] as const;

const specialMunicipals = {
    OS: ["OS (INNLANDET)"],
    SANDE: ["SANDE (MØRE OG ROMSDAL)"],
    BØ: ["BØ (NORDLAND)"],
    NES: ["NES (VIKEN)", "NES (AKERSHUS)"],
} as const;

function isSpecialMunicipal(municipal: string): municipal is keyof typeof specialMunicipals {
    return Object.hasOwn(specialMunicipals, municipal);
}

function mapSortByValue(value: string): "expires" | "published" {
    switch (value) {
        case "expires": {
            return "expires";
        }
        case "published":
        default: {
            return "published";
        }
    }
}

function mapSortByOrder(value: string): "asc" | "desc" {
    if (value !== "published") {
        return "asc";
    }

    return "desc";
}

function createTermFilter(field: string, value: Primitive): TermFilter {
    return {
        term: {
            [field]: value,
        },
    };
}

function createTermsFilter(field: string, values: readonly string[]): TermsFilter {
    return {
        terms: {
            [field]: [...values],
        },
    };
}

function createExistsFilter(field: string): ExistsFilter {
    return {
        exists: {
            field,
        },
    };
}

function createBoolShouldFilter(clauses: readonly QueryClause[]): BoolFilter {
    return {
        bool: {
            should: [...clauses],
        },
    };
}

function createBoolMustFilter(clauses: readonly QueryClause[]): BoolFilter {
    return {
        bool: {
            must: [...clauses],
        },
    };
}

function createMissingFieldFilter(field: string): BoolFilter {
    return {
        bool: {
            must_not: [createExistsFilter(field)],
        },
    };
}

function createOptionalShouldFilter(
    values: readonly string[] | undefined,
    createClause: (value: string) => QueryClause,
    options?: Readonly<{
        missingValue?: string;
        missingField?: string;
    }>,
): BoolFilter[] {
    if (!values || values.length === 0) {
        return [];
    }

    const clauses: QueryClause[] = values.map((value) => {
        return createClause(value);
    });

    if (options?.missingValue != null && options.missingField != null && values.includes(options.missingValue)) {
        clauses.push(createMissingFieldFilter(options.missingField));
    }

    return [createBoolShouldFilter(clauses)];
}

function createInternationalLocationFilter(
    countries: string[] | undefined,
    international: boolean,
): BoolFilter | undefined {
    const mustNot = international ? createTermFilter("locationList.country.keyword", "NORGE") : undefined;

    const should =
        Array.isArray(countries) && countries.length > 0
            ? countries.map((country) => {
                  return createTermFilter("locationList.country.keyword", country);
              })
            : undefined;

    if (mustNot == null && should == null) {
        return undefined;
    }

    return {
        bool: {
            ...(mustNot != null ? { must_not: mustNot } : {}),
            ...(should != null ? { should } : {}),
        },
    };
}

function filterPublished(published: string | undefined): RangeFilter[] {
    if (!published) {
        return [];
    }

    return [
        {
            range: {
                published: {
                    gte: published,
                    time_zone: "CET",
                },
            },
        },
    ];
}

export function filterWithinDrivingDistance(withinDrivingDistance: Locations | undefined): NestedFilter {
    const clauses: QueryClause[] = [];

    if (!withinDrivingDistance) {
        return {
            nested: {
                path: "locationList",
                query: {
                    bool: {
                        should: [],
                    },
                },
            },
        };
    }

    const { postcodes, municipals, counties } = withinDrivingDistance;

    if (Array.isArray(postcodes)) {
        clauses.push(createTermsFilter("locationList.postalCode", postcodes));
    }

    if (Array.isArray(municipals)) {
        clauses.push(
            createBoolMustFilter([
                createMissingFieldFilter("locationList.postalCode"),
                createTermsFilter("locationList.municipal.keyword", municipals),
            ]),
        );
    }

    if (Array.isArray(counties)) {
        clauses.push(
            createBoolMustFilter([
                createMissingFieldFilter("locationList.postalCode"),
                createMissingFieldFilter("locationList.municipal"),
                createTermsFilter("locationList.county.keyword", counties),
            ]),
        );
    }

    return {
        nested: {
            path: "locationList",
            query: {
                bool: {
                    should: clauses,
                },
            },
        },
    };
}

function filterRemote(remote: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(
        remote,
        (item) => {
            return createTermFilter("properties.remote", item);
        },
        {
            missingValue: NOT_DEFINED,
            missingField: "properties.remote",
        },
    );
}

function filterExtent(extent: string[] | undefined): BoolFilter[] {
    if (!extent || extent.length === 0) {
        return [];
    }

    const clauses: QueryClause[] = [];

    extent.forEach((item) => {
        if (item === ExtentEnum.HELTID) {
            clauses.push(createTermFilter("extent_facet", ExtentEnum.HELTID));
            clauses.push(createTermFilter("extent_facet", ExtentEnum.HELTID_OG_DELTID));
        } else if (item === ExtentEnum.DELTID) {
            clauses.push(createTermFilter("extent_facet", ExtentEnum.DELTID));
            clauses.push(createTermFilter("extent_facet", ExtentEnum.HELTID_OG_DELTID));
        } else {
            clauses.push(createTermFilter("extent_facet", ExtentEnum.UKJENT));
        }
    });

    return [createBoolShouldFilter(clauses)];
}

function filterWorkLanguage(workLanguage: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(
        workLanguage,
        (item) => {
            return createTermFilter("worklanguage_facet", item);
        },
        {
            missingValue: NOT_DEFINED,
            missingField: "worklanguage_facet",
        },
    );
}

function filterEducation(education: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(
        education,
        (item) => {
            return createTermFilter("education_facet", item);
        },
        {
            missingValue: NOT_DEFINED,
            missingField: "education_facet",
        },
    );
}

function filterNeedDriversLicense(needDriversLicense: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(
        needDriversLicense,
        (item) => {
            return createTermFilter("needDriversLicense_facet", item);
        },
        {
            missingValue: NOT_DEFINED,
            missingField: "needDriversLicense_facet",
        },
    );
}

function filterUnder18(under18: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(
        under18,
        (item) => {
            return createTermFilter("under18_facet", item);
        },
        {
            missingValue: NOT_DEFINED,
            missingField: "under18_facet",
        },
    );
}

function filterExperience(experience: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(
        experience,
        (item) => {
            return createTermFilter("experience_facet", item);
        },
        {
            missingValue: NOT_DEFINED,
            missingField: "experience_facet",
        },
    );
}

function filterEngagementType(engagementTypes: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(engagementTypes, (engagementType) => {
        return createTermFilter("engagementtype_facet", engagementType);
    });
}

/**
 * Lager filter for fasetter med flere nivå, feks fylke og kommune. Kombinerer AND og OR.
 * Feks (Akershus) OR (Buskerud) hvis man bare har valgt disse to fylkene.
 * Feks (Akershus AND (Asker OR Bærum)) OR (Buskerud AND Drammen) om man ser etter jobb i Asker, Bærum eller Drammen
 * Feks (Akershus) OR (Buskerud AND Drammen) om man ser etter jobb i hele Akershus fylke, men også i Drammen kommune.
 */
function filterNestedFacets(
    parents: string[] | undefined,
    children: string[],
    parentKey: string,
    childKey: string,
    nestedField?: string,
): BoolFilter | NestedFilter {
    const parentClauses: QueryClause[] = [];

    if (parents && parents.length > 0) {
        parents.forEach((parent) => {
            const mustClauses: QueryClause[] = [createTermFilter(parentKey, parent)];

            const childrenOfCurrentParent = children.filter((child) => {
                return child.split(".")[0] === parent;
            });

            if (childrenOfCurrentParent.length > 0) {
                mustClauses.push(
                    createBoolShouldFilter(
                        childrenOfCurrentParent.map((child) => {
                            return createTermFilter(childKey, child.split(".")[1] ?? "");
                        }),
                    ),
                );
            }

            parentClauses.push(createBoolMustFilter(mustClauses));
        });
    }

    const queryObject: BoolFilter = {
        bool: {
            should: parentClauses,
        },
    };

    if (nestedField) {
        return {
            nested: {
                path: nestedField,
                query: queryObject,
            },
        };
    }

    return queryObject;
}

// Filtrer på alle type locations (land, kommune, fylke, internasjonalt)
export function filterLocation(
    counties: string[] | undefined,
    municipals: string[] | undefined,
    countries: string[] | undefined,
    international: boolean = false,
): NestedFilter {
    const shouldClauses: QueryClause[] = [];

    if (Array.isArray(counties)) {
        const countiesComputed = counties.map((county) => {
            return {
                key: county,
                municipals: Array.isArray(municipals)
                    ? municipals.filter((municipal) => {
                          return municipal.split(".")[0] === county;
                      })
                    : [],
            };
        });

        countiesComputed.forEach((county) => {
            const mustClauses: QueryClause[] = [createTermFilter("locationList.county.keyword", county.key)];

            if (county.municipals.length > 0) {
                let municipalShouldClauses: QueryClause[] = [];

                if (countries && countries.includes("Hack")) {
                    municipalShouldClauses = [createMissingFieldFilter("locationList.municipal.keyword")];
                }

                county.municipals.forEach((municipalKey) => {
                    const municipal = municipalKey.split(".")[1];

                    if (isSpecialMunicipal(municipal)) {
                        municipalShouldClauses.push(
                            createTermsFilter("locationList.municipal.keyword", [
                                municipal,
                                ...specialMunicipals[municipal],
                            ]),
                        );
                    } else {
                        municipalShouldClauses.push(createTermFilter("locationList.municipal.keyword", municipal));
                    }
                });

                mustClauses.push(createBoolShouldFilter(municipalShouldClauses));
            }

            shouldClauses.push(createBoolMustFilter(mustClauses));
        });
    }

    const internationalFilter = createInternationalLocationFilter(countries, international);

    if (internationalFilter != null) {
        shouldClauses.push(internationalFilter);
    }

    return {
        nested: {
            path: "locationList",
            query: {
                bool: {
                    should: shouldClauses,
                },
            },
        },
    };
}

function filterOccupation(
    occupationFirstLevels: string[] | undefined,
    occupationSecondLevels: string[] = [],
): BoolFilter | NestedFilter {
    return filterNestedFacets(
        occupationFirstLevels,
        occupationSecondLevels,
        "occupationList.level1",
        "occupationList.level2",
        "occupationList",
    );
}

function filterSector(sector: string[] | undefined): BoolFilter[] {
    return createOptionalShouldFilter(sector, (item) => {
        return createTermFilter("sector_facet", item);
    });
}

function createFilterGroups(query: ExtendedQuery): FilterGroups {
    const {
        counties,
        countries,
        experience,
        education,
        municipals,
        needDriversLicense,
        under18,
        extent,
        workLanguage,
        remote,
        engagementType,
        sector,
        published,
        occupationFirstLevels,
        occupationSecondLevels,
        international,
        withinDrivingDistance,
    } = query;

    return {
        needDriversLicense: filterNeedDriversLicense(needDriversLicense),
        under18: filterUnder18(under18),
        experience: filterExperience(experience),
        extent: filterExtent(extent),
        education: filterEducation(education),
        workLanguage: filterWorkLanguage(workLanguage),
        remote: filterRemote(remote),
        location: [filterLocation(counties, municipals, countries, international)],
        occupation: [filterOccupation(occupationFirstLevels, occupationSecondLevels)],
        engagementType: filterEngagementType(engagementType),
        sector: filterSector(sector),
        published: filterPublished(published),
        withinDrivingDistance: [filterWithinDrivingDistance(withinDrivingDistance)],
    };
}

function buildFilters(filterGroups: FilterGroups, options?: BuildFiltersOptions): QueryClause[] {
    const excludedGroups = new Set(options?.exclude ?? []);

    const filters = FILTER_GROUP_ORDER.flatMap((filterGroupKey) => {
        if (excludedGroups.has(filterGroupKey)) {
            return [];
        }

        return [...filterGroups[filterGroupKey]];
    });

    if (options?.extra && options.extra.length > 0) {
        return [...filters, ...options.extra];
    }

    return filters;
}

function createFilteredAggregation(
    filterGroups: FilterGroups,
    aggs: Aggregations,
    options?: BuildFiltersOptions,
): AggregationDefinition {
    return {
        filter: {
            bool: {
                filter: buildFilters(filterGroups, options),
            },
        },
        aggs,
    };
}

function createNonNorwayNestedCountryFilter(): NestedFilter {
    return {
        nested: {
            path: "locationList",
            query: {
                bool: {
                    must_not: createTermFilter("locationList.country.keyword", "NORGE"),
                },
            },
        },
    };
}

function mainQueryTemplateFunc(qAsArray: string[]): BoolFilter {
    const matchFields = [
        "category_name_no^2",
        "title_no^2",
        "keywords_no^1",
        "searchtagsai_no^1",
        "searchtags_no^1",
        "adtext_no^0.1",
        "employerdescription_no^0.1",
    ];

    return {
        bool: {
            must: {
                bool: {
                    should: [
                        ...baseFreeTextSearchMatch(qAsArray, matchFields),
                        ...businessNameFreeTextSearchMatch(qAsArray),
                        ...geographyAllTextSearchMatch(qAsArray),
                        englishFreeTextSearchMatch(qAsArray),
                        {
                            match: {
                                id: {
                                    query: qAsArray.join(" ").trim(),
                                    operator: "and",
                                    boost: 1,
                                },
                            },
                        },
                    ],
                },
            },
            should: [...titleFreeTextSearchMatch(qAsArray)],
            filter: filterTermsWithEnglishFreeText(qAsArray),
        },
    };
}

function baseFreeTextSearchMatch(queries: string[], fields: string[]): MatchQuery[] {
    return queries.map((query) => {
        return {
            multi_match: {
                query,
                type: "cross_fields",
                fields,
                operator: "and",
                tie_breaker: 0.3,
                analyzer: "norwegian_custom",
                zero_terms_query: "all",
            },
        };
    });
}

function businessNameFreeTextSearchMatch(queries: string[]): MatchQuery[] {
    return queries.map((query) => {
        return {
            match: {
                businessName: {
                    query,
                    fuzziness: "AUTO",
                    max_expansions: 2,
                    prefix_length: 1,
                    operator: "and",
                    boost: 2,
                    analyzer: "search_synonyms_analyzer",
                },
            },
        };
    });
}

function geographyAllTextSearchMatch(queries: string[]): MatchQuery[] {
    return queries.map((query) => {
        return {
            match_phrase: {
                geography_all: {
                    query,
                    slop: 0,
                    boost: 2,
                },
            },
        };
    });
}

function titleFreeTextSearchMatch(queries: string[]): MatchQuery[] {
    return queries.map((query) => {
        return {
            match_phrase: {
                title: {
                    query,
                    slop: 2,
                },
            },
        };
    });
}

function englishFreeTextSearchMatch(queries: string[]): MatchQuery {
    const freeTextOnlyContainsEnglish = queries.length === 1 && queries[0].toLowerCase() === "english";

    return {
        match_phrase: {
            worklanguage_facet: {
                query: freeTextOnlyContainsEnglish ? "Engelsk" : "",
                boost: 2,
            },
        },
    };
}

function filterTermsWithEnglishFreeText(queries: string[]): TermFilter | readonly TermFilter[] {
    if (
        queries.length > 1 &&
        queries
            .map((query) => {
                return query.toLowerCase();
            })
            .includes("english")
    ) {
        return [createTermFilter("status", "ACTIVE"), createTermFilter("worklanguage_facet", "Engelsk")];
    }

    return createTermFilter("status", "ACTIVE");
}

const elasticSearchRequestBody = (query: ExtendedQuery): OpenSearchRequestBody => {
    const { from, size, explain } = query;
    let { sort, q } = query;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.length === 0) {
        if (sort !== "expires") {
            sort = "published";
        }

        q = [""];
    }

    const filterGroups = createFilterGroups(query);

    let template: OpenSearchRequestBody = {
        explain: explain === true,
        from: from || 0,
        size: size && ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(size) ? size : SEARCH_CHUNK_SIZE,
        track_total_hits: true,
        min_score: 0.7,
        query: mainQueryTemplateFunc(q),
        post_filter: {
            bool: {
                filter: buildFilters(filterGroups),
            },
        },
        _source: {
            includes: SOURCE_INCLUDES,
        },
        aggs: {
            positioncount: createFilteredAggregation(filterGroups, {
                sum: {
                    sum: {
                        field: "properties.positioncount",
                        missing: 1,
                    },
                },
            }),

            published: createFilteredAggregation(
                filterGroups,
                {
                    range: {
                        date_range: {
                            field: "published",
                            time_zone: "CET",
                            ranges: [
                                {
                                    key: "now/d",
                                    from: "now/d",
                                },
                                {
                                    key: "now-3d",
                                    from: "now-3d",
                                },
                                {
                                    key: "now-7d",
                                    from: "now-7d",
                                },
                            ],
                        },
                    },
                },
                {
                    exclude: ["published"],
                },
            ),

            sector: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "sector_facet",
                        },
                    },
                },
                {
                    exclude: ["sector"],
                },
            ),

            extent: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        filters: {
                            filters: {
                                Heltid: {
                                    bool: {
                                        should: [
                                            createTermFilter("extent_facet", "Heltid"),
                                            createTermFilter("extent_facet", "Heltid_and_Deltid"),
                                        ],
                                    },
                                },
                                Deltid: {
                                    bool: {
                                        should: [
                                            createTermFilter("extent_facet", "Deltid"),
                                            createTermFilter("extent_facet", "Heltid_and_Deltid"),
                                        ],
                                    },
                                },
                                "Ikke oppgitt": {
                                    term: {
                                        extent_facet: "Ukjent",
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    exclude: ["extent"],
                },
            ),

            remote: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "properties.remote",
                            missing: NOT_DEFINED,
                        },
                    },
                },
                {
                    exclude: ["remote"],
                },
            ),

            workLanguage: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "worklanguage_facet",
                            missing: NOT_DEFINED,
                        },
                    },
                },
                {
                    exclude: ["workLanguage"],
                },
            ),

            education: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "education_facet",
                            missing: NOT_DEFINED,
                        },
                    },
                },
                {
                    exclude: ["education"],
                },
            ),

            needDriversLicense: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "needDriversLicense_facet",
                            missing: NOT_DEFINED,
                        },
                    },
                },
                {
                    exclude: ["needDriversLicense"],
                },
            ),

            under18: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "under18_facet",
                            missing: NOT_DEFINED,
                        },
                    },
                },
                {
                    exclude: ["under18"],
                },
            ),

            experience: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "experience_facet",
                            missing: NOT_DEFINED,
                        },
                    },
                },
                {
                    exclude: ["experience", "withinDrivingDistance"],
                },
            ),

            engagementType: createFilteredAggregation(
                filterGroups,
                {
                    values: {
                        terms: {
                            field: "engagementtype_facet",
                        },
                    },
                },
                {
                    exclude: ["engagementType"],
                },
            ),

            counties: createFilteredAggregation(
                filterGroups,
                {
                    nestedLocations: {
                        nested: {
                            path: "locationList",
                        },
                        aggs: {
                            values: {
                                terms: {
                                    field: "locationList.county.keyword",
                                    size: 50,
                                    order: {
                                        _key: "asc",
                                    },
                                },
                                aggs: {
                                    root_doc_count: {
                                        reverse_nested: {},
                                    },
                                    municipals: {
                                        terms: {
                                            field: "locationList.municipal.keyword",
                                            size: 200,
                                            order: {
                                                _key: "asc",
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    exclude: ["location"],
                },
            ),

            occupations: createFilteredAggregation(
                filterGroups,
                {
                    nestedOccupations: {
                        nested: {
                            path: "occupationList",
                        },
                        aggs: {
                            occupationFirstLevels: {
                                terms: {
                                    field: "occupationList.level1",
                                    size: 50,
                                },
                                aggs: {
                                    root_doc_count: {
                                        reverse_nested: {},
                                    },
                                    occupationSecondLevels: {
                                        terms: {
                                            field: "occupationList.level2",
                                            size: 100,
                                        },
                                        aggs: {
                                            root_doc_count: {
                                                reverse_nested: {},
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    exclude: ["occupation"],
                },
            ),

            countries: createFilteredAggregation(
                filterGroups,
                {
                    nestedLocations: {
                        nested: {
                            path: "locationList",
                        },
                        aggs: {
                            values: {
                                terms: {
                                    field: "locationList.country.keyword",
                                    exclude: "NORGE",
                                    size: 50,
                                    order: {
                                        _key: "asc",
                                    },
                                },
                            },
                        },
                    },
                },
                {
                    exclude: ["location"],
                    extra: [createNonNorwayNestedCountryFilter()],
                },
            ),
        },
    };

    if (sort && sort !== "relevant") {
        template = {
            ...template,
            sort: [
                {
                    [mapSortByValue(sort)]: {
                        order: mapSortByOrder(sort),
                    },
                },
                "_score",
                "_id",
            ],
        };
    }

    return template;
};

export default elasticSearchRequestBody;
