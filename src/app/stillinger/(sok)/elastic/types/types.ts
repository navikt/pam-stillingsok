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
    bool: {
        must?: MatchQuery[];
        should?: MatchQuery[];
        must_not?: MatchQuery[];
        filter?: MatchQuery[];
    };
}

export type Sort =
    | {
          [field: string]: {
              order: "asc" | "desc";
              [key: string]: string | number | boolean;
          } & Record<string, unknown>;
      }
    | "_score"
    | "_id";

interface TermQuery {
    term?: {
        [field: string]: string | number | boolean;
    };
}

// OpenSearch request body
export type OpenSearchRequestBody = {
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

export type TermFilter = {
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

export type BoolFilter = {
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

export type NestedFilter = {
    nested: {
        path: string;
        query: BoolFilter;
    };
};

export type RangeFilter = {
    range: {
        published: {
            gte: string;
            time_zone: string;
        };
    };
};
