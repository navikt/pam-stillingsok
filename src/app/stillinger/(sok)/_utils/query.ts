import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";
import { QueryNames } from "@/app/stillinger/(sok)/_utils/QueryNames";
import { SOMMERJOBB_SEARCH_RESULT_SIZE } from "@/app/sommerjobb/_components/constants";

export const SEARCH_CHUNK_SIZE = 25;
export const ALLOWED_NUMBER_OF_RESULTS_PER_PAGE = [SEARCH_CHUNK_SIZE, SEARCH_CHUNK_SIZE * 4];

export function asArray(value: unknown) {
    if (value == null) {
        return [];
    }
    if (Array.isArray(value)) {
        return value;
    }

    return [value];
}
export type DefaultQuery = {
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
    occupations?: string[];
    occupationFirstLevels?: string[];
    occupationSecondLevels?: string[];
    postcode?: string | undefined;
    distance?: string | undefined;
    published?: string | undefined;
    sector?: string[];
    sort?: string;
    international?: boolean;
    workLanguage?: string[];
    match?: string | undefined;
    v?: number;
};

export const defaultQuery: DefaultQuery = {
    q: [],
    from: 0,
    size: SEARCH_CHUNK_SIZE,
    counties: [],
    countries: [],
    needDriversLicense: [],
    under18: [],
    education: [],
    engagementType: [],
    experience: [],
    extent: [],
    remote: [],
    municipals: [],
    occupations: [],
    occupationFirstLevels: [],
    occupationSecondLevels: [],
    postcode: undefined,
    distance: undefined,
    published: undefined,
    sector: [],
    sort: "",
    international: false,
    workLanguage: [],
    match: undefined,
    v: CURRENT_VERSION,
};

export function createQuery(searchParams: Record<string, string | string[] | undefined>): DefaultQuery {
    if (searchParams == null) {
        return defaultQuery;
    }

    const searchParamFrom = searchParams.from;
    const searchParamSize = searchParams.size;
    const from = searchParamFrom
        ? parseInt(Array.isArray(searchParamFrom) ? searchParamFrom[0] : searchParamFrom, 10)
        : defaultQuery.from;

    const size = searchParamSize
        ? [SOMMERJOBB_SEARCH_RESULT_SIZE, ...ALLOWED_NUMBER_OF_RESULTS_PER_PAGE].includes(
              parseInt(Array.isArray(searchParamSize) ? searchParamSize[0] : searchParamSize, 10),
          )
            ? parseInt(Array.isArray(searchParamSize) ? searchParamSize[0] : searchParamSize, 10)
            : defaultQuery.size
        : defaultQuery.size;

    return {
        from: from,
        size: size,
        q: asArray(searchParams.q) || defaultQuery.q,
        match: Array.isArray(searchParams.match) ? searchParams.match[0] : searchParams.match || defaultQuery.match,
        municipals: asArray(searchParams.municipal) || defaultQuery.municipals,
        counties: asArray(searchParams.county) || defaultQuery.counties,
        countries: asArray(searchParams.country) || defaultQuery.countries,
        international: searchParams.international === "true",
        remote: asArray(searchParams.remote) || defaultQuery.remote,
        occupations: asArray(searchParams.occupation) || defaultQuery.occupations,
        occupationFirstLevels: asArray(searchParams.occupationLevel1) || defaultQuery.occupationFirstLevels,
        occupationSecondLevels: asArray(searchParams.occupationLevel2) || defaultQuery.occupationSecondLevels,
        postcode: Array.isArray(searchParams.postcode)
            ? searchParams.postcode[0]
            : searchParams.postcode || defaultQuery.postcode,
        distance: Array.isArray(searchParams.distance)
            ? searchParams.distance[0]
            : searchParams.distance || defaultQuery.distance,
        published: Array.isArray(searchParams.published)
            ? searchParams.published[0]
            : searchParams.published || defaultQuery.published,

        needDriversLicense: asArray(searchParams.needDriversLicense) || defaultQuery.needDriversLicense,
        under18: asArray(searchParams.under18) || defaultQuery.under18,
        experience: asArray(searchParams.experience) || defaultQuery.experience,
        extent: asArray(searchParams.extent) || defaultQuery.extent,
        engagementType: asArray(searchParams.engagementType) || defaultQuery.engagementType,
        sector: asArray(searchParams.sector) || defaultQuery.sector,
        education: asArray(searchParams.education) || defaultQuery.education,
        workLanguage: asArray(searchParams.workLanguage) || defaultQuery.workLanguage,
        sort: Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort || defaultQuery.sort,
        v: Array.isArray(searchParams.v)
            ? parseInt(searchParams.v[0], 10)
            : parseInt(searchParams.v || `${defaultQuery.v}`, 10),
    };
}

export function removeUnwantedOrEmptySearchParameters(query: DefaultQuery): DefaultQuery {
    const newObj: Record<string, unknown> = {};
    Object.keys(query).forEach((prop) => {
        const value = (query as Record<string, unknown>)[prop];

        if (prop === "international" && value === false) {
            // Skip international flag if it is false
        } else if (Array.isArray(value)) {
            if (value.length > 0) {
                newObj[prop] = value;
            }
        } else if (value !== undefined && value !== "") {
            newObj[prop] = value;
        }
    });

    // If no other properties, remove the version property
    // We don't want the url to show /stillinger?v=1
    if (Object.keys(newObj).length === 1 && Object.hasOwn(newObj, QueryNames.URL_VERSION)) {
        return {};
    }

    return newObj;
}

/**
 * Returns a search query optimized for backend api call
 */
export function toApiQuery(query: DefaultQuery) {
    const apiSearchQuery = {
        ...query,
        sort: query.sort === "" ? "relevant" : query.sort,
    };

    const newQuery = removeUnwantedOrEmptySearchParameters(apiSearchQuery);

    // Postcode and distance are only relevant to search for if both are set
    // Should NOT be moved to the removeUnwantedOrEmptySearchParameters function, as it also will remove it from the URL query params
    if (!(newQuery.postcode && newQuery.postcode.length === 4 && newQuery.distance)) {
        delete newQuery.postcode;
        delete newQuery.distance;
    }

    return newQuery;
}
