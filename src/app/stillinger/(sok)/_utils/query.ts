import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";

export const SEARCH_CHUNK_SIZE = 25;
export const ALLOWED_NUMBER_OF_RESULTS_PER_PAGE = [SEARCH_CHUNK_SIZE, SEARCH_CHUNK_SIZE * 4];
export const ALLOWED_SORT_VALUES = ["relevant", "published", "expires"];
export const DEFAULT_SORTING = "relevant";

function asArray(value: unknown) {
    if (value == null) {
        return undefined;
    }
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}

function asInteger(value: string | string[] | undefined) {
    let result;

    if (!value) {
        return undefined;
    } else if (Array.isArray(value)) {
        result = parseInt(value[0], 10);
    } else {
        result = parseInt(value, 10);
    }

    if (Number.isNaN(result)) {
        return undefined;
    }

    return result;
}

export type SearchQuery = {
    q?: string[];
    from?: number;
    size?: number;
    counties?: string[];
    countries?: string[];
    needDriversLicense?: string[];
    under18?: string[];
    education?: string[];
    engagementType?: string[];
    experience?: string[];
    extent?: string[];
    remote?: string[];
    municipals?: string[];
    occupationFirstLevels?: string[];
    occupationSecondLevels?: string[];
    postcode?: string | undefined;
    distance?: string | undefined;
    published?: string | undefined;
    sector?: string[];
    sort?: string;
    international?: boolean;
    workLanguage?: string[];
    v?: number;
    k?: number;
    explain?: boolean;
};

export function createQuery(params: Record<string, string | string[] | undefined>): SearchQuery {
    const searchParams = params || {};

    const size = asInteger(searchParams.size);
    const sort = Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort || DEFAULT_SORTING;

    return {
        size: size && ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(size) ? size : SEARCH_CHUNK_SIZE,
        from: asInteger(searchParams.from) || 0,
        q: asArray(searchParams.q),
        municipals: asArray(searchParams.municipal),
        counties: asArray(searchParams.county),
        countries: asArray(searchParams.country),
        international: searchParams.international === "true" ? true : undefined,
        remote: asArray(searchParams.remote),
        occupationFirstLevels: asArray(searchParams.occupationLevel1),
        occupationSecondLevels: asArray(searchParams.occupationLevel2),
        postcode: Array.isArray(searchParams.postcode) ? searchParams.postcode[0] : searchParams.postcode,
        distance: Array.isArray(searchParams.distance) ? searchParams.distance[0] : searchParams.distance,
        published: Array.isArray(searchParams.published) ? searchParams.published[0] : searchParams.published,
        needDriversLicense: asArray(searchParams.needDriversLicense),
        under18: asArray(searchParams.under18),
        experience: asArray(searchParams.experience),
        extent: asArray(searchParams.extent),
        engagementType: asArray(searchParams.engagementType),
        sector: asArray(searchParams.sector),
        education: asArray(searchParams.education),
        workLanguage: asArray(searchParams.workLanguage),
        sort: sort && ALLOWED_SORT_VALUES.includes(sort) ? sort : DEFAULT_SORTING,
        v: asInteger(searchParams.v) || CURRENT_VERSION,
        k: asInteger(searchParams.k) || 10,
        explain: searchParams.explain === "true",
    };
}

/**
 * Returns a search query optimized for backend api call
 */
export function toApiQuery(query: SearchQuery): SearchQuery {
    const apiSearchQuery = {
        ...query,
    };

    // Postcode and distance are only relevant to search for if both are set
    if (!(apiSearchQuery.postcode && apiSearchQuery.postcode.length === 4 && apiSearchQuery.distance)) {
        delete apiSearchQuery.postcode;
        delete apiSearchQuery.distance;
    }

    return apiSearchQuery;
}
