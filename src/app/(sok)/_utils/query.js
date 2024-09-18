import { CURRENT_VERSION, VERSION_QUERY_PARAM } from "@/app/(sok)/_utils/searchParamsVersioning";

export const SEARCH_CHUNK_SIZE = 25;
export const ALLOWED_NUMBER_OF_RESULTS_PER_PAGE = [SEARCH_CHUNK_SIZE, SEARCH_CHUNK_SIZE * 4];

function asArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (value) {
        return [value];
    }
    return [];
}

export const defaultQuery = {
    q: [],
    from: 0,
    size: SEARCH_CHUNK_SIZE,
    counties: [],
    countries: [],
    needDriversLicense: [],
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

// eslint-disable-next-line import/prefer-default-export
export function createQuery(searchParams) {
    return {
        from: searchParams.from ? parseInt(searchParams.from, 10) : 0,
        size:
            searchParams.size && ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(parseInt(searchParams.size, 10))
                ? parseInt(searchParams.size, 10)
                : defaultQuery.size,
        q: asArray(searchParams.q) || defaultQuery.q,
        match: searchParams.match || defaultQuery.match,
        municipals: asArray(searchParams.municipal) || defaultQuery.municipals,
        counties: asArray(searchParams.county) || defaultQuery.counties,
        countries: asArray(searchParams.country) || defaultQuery.countries,
        international: searchParams.international === "true",
        remote: asArray(searchParams.remote) || defaultQuery.remote,
        occupations: asArray(searchParams.occupation) || defaultQuery.occupations,
        occupationFirstLevels: asArray(searchParams.occupationLevel1) || defaultQuery.occupationFirstLevels,
        occupationSecondLevels: asArray(searchParams.occupationLevel2) || defaultQuery.occupationSecondLevels,
        postcode: searchParams.postcode || defaultQuery.postcode,
        distance: searchParams.distance || defaultQuery.distance,
        published: searchParams.published || defaultQuery.published,
        needDriversLicense: asArray(searchParams.needDriversLicense) || defaultQuery.needDriversLicense,
        experience: asArray(searchParams.experience) || defaultQuery.experience,
        extent: asArray(searchParams.extent) || defaultQuery.extent,
        engagementType: asArray(searchParams.engagementType) || defaultQuery.engagementType,
        sector: asArray(searchParams.sector) || defaultQuery.sector,
        education: asArray(searchParams.education) || defaultQuery.education,
        workLanguage: asArray(searchParams.workLanguage) || defaultQuery.workLanguage,
        sort: searchParams.sort || defaultQuery.sort,
        v: searchParams.v || defaultQuery.v,
    };
}

export function removeUnwantedOrEmptySearchParameters(query) {
    const newObj = {};
    Object.keys(query).forEach((prop) => {
        const value = query[prop];

        if (prop === "international" && value === false) {
            // Skip international flag if it is false
        } else if (prop === "paginate") {
            // Always skip paginate parameter
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
    if (Object.keys(newObj).length === 1 && Object.hasOwn(newObj, VERSION_QUERY_PARAM)) {
        return {};
    }

    return newObj;
}

/**
 * Returns a search query optimized for backend api call
 */
export function toApiQuery(query) {
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

/**
 * Returns a search query optimized for browser url
 */
export function toBrowserQuery(query) {
    const browserQuery = {
        ...query,
    };

    if (browserQuery.from === 0) {
        delete browserQuery.from;
    }

    if (browserQuery.size === SEARCH_CHUNK_SIZE) {
        delete browserQuery.size;
    }

    return removeUnwantedOrEmptySearchParameters(browserQuery);
}

function getKeyName(key) {
    switch (key) {
        case "municipals":
            return "municipal";
        case "counties":
            return "county";
        case "countries":
            return "country";
        case "occupations":
            return "occupation";
        case "occupationFirstLevels":
            return "occupationLevel1";
        case "occupationSecondLevels":
            return "occupationLevel2";
        default:
            return key;
    }
}

/**
 * Takes a query object, f.ex {"q":"javascript","counties":["OSLO"]},
 * and returns an encoded query string, f.ex "?q=javascript&counties=OSLO".
 */
export function stringifyQuery(query = {}) {
    const string = Object.keys(query)
        .map((key) => {
            const value = query[key];
            const keyName = getKeyName(key);
            if (Array.isArray(value)) {
                return value.map((val) => `${encodeURIComponent(keyName)}=${encodeURIComponent(val)}`).join("&");
            }
            return `${encodeURIComponent(keyName)}=${encodeURIComponent(query[key])}`;
        })
        .filter((elem) => elem !== "")
        .join("&");

    if (string.length > 0) {
        return `?${string}`;
    }
    return "";
}
