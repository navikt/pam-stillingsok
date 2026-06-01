import type { ExtendedQuery } from "@/app/stillinger/(sok)/_utils/fetchElasticSearch";
import type { BoolFilter } from "@/app/stillinger/(sok)/elastic/types/types";

export function buildQuery(query: ExtendedQuery): BoolFilter {
    let q = query.q;

    // To ensure consistent search results across multiple shards in elasticsearch when query is blank
    if (!q || q.length === 0) {
        q = [""];
    }

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
                        ...baseFreeTextSearchMatch(q, matchFields),
                        ...businessNameFreeTextSearchMatch(q),
                        ...geographyAllTextSearchMatch(q),
                        englishFreeTextSearchMatch(q),
                        {
                            match: {
                                id: {
                                    query: q.join(" ").trim(),
                                    operator: "and",
                                    boost: 1,
                                },
                            },
                        },
                    ],
                },
            },
            should: [...titleFreeTextSearchMatch(q)],
            filter: filterTermsWithEnglishFreeText(q),
        },
    };
}

function baseFreeTextSearchMatch(queries: string[], fields: string[]) {
    return queries.map((q) => ({
        multi_match: {
            query: q,
            type: "cross_fields",
            fields: fields,
            operator: "and",
            tie_breaker: 0.3,
            analyzer: "norwegian_custom",
            zero_terms_query: "all",
        },
    }));
}

function businessNameFreeTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match: {
            businessName: {
                query: q,
                fuzziness: "AUTO",
                max_expansions: 2,
                prefix_length: 1,
                operator: "and",
                boost: 2,
                analyzer: "search_synonyms_analyzer",
            },
        },
    }));
}

function geographyAllTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match_phrase: {
            geography_all: {
                query: q,
                slop: 0,
                boost: 2,
            },
        },
    }));
}

function titleFreeTextSearchMatch(queries: string[]) {
    return queries.map((q) => ({
        match_phrase: {
            title: {
                query: q,
                slop: 2,
            },
        },
    }));
}

function englishFreeTextSearchMatch(queries: string[]) {
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

function filterTermsWithEnglishFreeText(queries: string[]) {
    if (queries.length > 1 && queries.map((q) => q.toLowerCase()).includes("english")) {
        return [
            {
                term: {
                    status: "ACTIVE",
                },
            },
            {
                term: {
                    worklanguage_facet: "Engelsk",
                },
            },
        ];
    }
    return {
        term: {
            status: "ACTIVE",
        },
    };
}
