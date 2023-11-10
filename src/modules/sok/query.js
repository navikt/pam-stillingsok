import fixLocationName from "../../../server/common/fixLocationName";

export const SEARCH_CHUNK_SIZE = 25;
export const ADD_MUNICIPAL = "ADD_MUNICIPAL";
export const REMOVE_MUNICIPAL = "REMOVE_MUNICIPAL";
export const ADD_COUNTY = "ADD_COUNTY";
export const REMOVE_COUNTY = "REMOVE_COUNTY";
export const ADD_COUNTRY = "ADD_COUNTRY";
export const REMOVE_COUNTRY = "REMOVE_COUNTRY";
export const ADD_OCCUPATION_FIRST_LEVEL = "ADD_OCCUPATION_FIRST_LEVEL";
export const REMOVE_OCCUPATION_FIRST_LEVEL = "REMOVE_OCCUPATION_FIRST_LEVEL";
export const ADD_OCCUPATION_SECOND_LEVEL = "ADD_OCCUPATION_SECOND_LEVEL";
export const REMOVE_OCCUPATION_SECOND_LEVEL = "REMOVE_OCCUPATION_SECOND_LEVEL";
export const ADD_ENGAGEMENT_TYPE = "ADD_ENGAGEMENT_TYPE";
export const REMOVE_ENGAGEMENT_TYPE = "REMOVE_ENGAGEMENT_TYPE";
export const ADD_EXTENT = "ADD_EXTENT";
export const REMOVE_EXTENT = "REMOVE_EXTENT";
export const ADD_REMOTE = "ADD_REMOTE";
export const REMOVE_REMOTE = "REMOVE_REMOTE";
export const ADD_SECTOR = "ADD_SECTOR";
export const REMOVE_SECTOR = "REMOVE_SECTOR";
export const SET_PUBLISHED = "SET_PUBLISHED";
export const SET_SEARCH_STRING = "SET_SEARCH_STRING";
export const SET_SORTING = "SET_SORTING";
export const SET_INTERNATIONAL = "SET_INTERNATIONAL";
export const SET_FROM = "SET_FROM";
export const RESET = "RESET";

export const PublishedLabelsEnum = {
    "now/d": "Nye i dag",
};

export const defaultQuery = {
    q: "",
    fields: undefined,
    from: 0,
    size: SEARCH_CHUNK_SIZE,
    counties: [],
    countries: [],
    engagementType: [],
    extent: [],
    remote: [],
    municipals: [],
    occupationFirstLevels: [],
    occupationSecondLevels: [],
    published: undefined,
    sector: [],
    sort: "",
    international: false,
};

/**
 * Decodes and parses a query string, f.ex "?q=javascript&counties[]=OSLO".
 * @return a query object, f.ex {"q":"javascript","counties":["OSLO"]}.
 */
function extractQueryParameters(encodedQueryString) {
    let decodeQueryString = encodedQueryString;

    // After login, the redirect url back to this page may have been encoded several times.
    // This function decodes url until it is no longer contains '%', for example %20 (space).
    // When url is fully decoded, it can try to decode again if the url
    // contains the percentage sign itself, and decode attempt will fail.
    // This can happen for example when searching for part-time job '?=50%'.
    try {
        while (decodeQueryString.includes("%")) {
            decodeQueryString = decodeURIComponent(decodeQueryString);
        }
    } catch (e) {
        // Ignore failed decode attempt
    }

    // Extract query parameters
    const urlParameters = decodeQueryString.substring(1).split("&");
    const query = {};
    urlParameters.forEach((parameter) => {
        const pair = parameter.split("=");
        if (pair[0] !== undefined && pair[0] !== "") {
            let key = pair[0];
            const val = pair[1] !== undefined ? pair[1] : "";

            if (key === "international") {
                query[key] = val === "true" ? true : "false";
            } else if (key.includes("[]")) {
                key = key.replace("[]", "");

                if (query[key] === undefined) {
                    query[key] = [val];
                } else {
                    query[key].push(val);
                }
            } else {
                query[key] = val;
            }
        }
    });
    return query;
}

/**
 * Takes a query and return a new object without empty properties.
 * An empty property can be an undefined value, an empty string or an empty array.
 */
function removeEmptyPropertiesFromQuery(query) {
    const newObj = {};
    Object.keys(query).forEach((prop) => {
        const value = query[prop];

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

    return newObj;
}

/**
 * Init function used to creating initial state for this reducer.
 * If user already has some search criteria in browser url, this will
 * be extracted and used.
 */
export function initQueryWithValuesFromBrowserUrl(initialState) {
    const fromBrowserUrl = extractQueryParameters(document.location.search);
    return {
        from: 0,
        size: fromBrowserUrl.to ? parseInt(fromBrowserUrl.to, 10) : SEARCH_CHUNK_SIZE,
        q: fromBrowserUrl.q || initialState.q,
        fields: fromBrowserUrl.fields || initialState.fields,
        municipals: fromBrowserUrl.municipals || initialState.municipals,
        counties: fromBrowserUrl.counties || initialState.counties,
        countries: fromBrowserUrl.countries || initialState.countries,
        international: fromBrowserUrl.international === true,
        remote: fromBrowserUrl.remote || initialState.remote,
        occupationFirstLevels: fromBrowserUrl.occupationFirstLevels || initialState.occupationFirstLevels,
        occupationSecondLevels: fromBrowserUrl.occupationSecondLevels || initialState.occupationSecondLevels,
        published: fromBrowserUrl.published || initialState.published,
        extent: fromBrowserUrl.extent || initialState.extent,
        engagementType: fromBrowserUrl.engagementType || initialState.engagementType,
        sector: fromBrowserUrl.sector || initialState.sector,
        sort: fromBrowserUrl.sort || initialState.sort,
    };
}

export default function queryReducer(state, action) {
    // Reset pagination when user add or remove a search criteria
    const queryState = {
        ...state,
        from: 0,
        size: SEARCH_CHUNK_SIZE,
    };

    switch (action.type) {
        case SET_INTERNATIONAL:
            return {
                ...queryState,
                international: action.value,
            };
        case ADD_COUNTY:
            return {
                ...queryState,
                counties: [...queryState.counties, action.value],
            };
        case REMOVE_COUNTY:
            return {
                ...queryState,
                counties: queryState.counties.filter((obj) => obj !== action.value),
                municipals: queryState.municipals.filter((obj) => !obj.startsWith(`${action.value}.`)),
            };
        case ADD_MUNICIPAL:
            return {
                ...queryState,
                municipals: [...queryState.municipals, action.value],
            };
        case REMOVE_MUNICIPAL:
            return {
                ...queryState,
                municipals: queryState.municipals.filter((obj) => obj !== action.value),
            };
        case ADD_COUNTRY:
            return {
                ...queryState,
                countries: [...queryState.countries, action.value],
            };
        case REMOVE_COUNTRY:
            return {
                ...queryState,
                countries: queryState.countries.filter((obj) => obj !== action.value),
            };
        case ADD_OCCUPATION_FIRST_LEVEL:
            return {
                ...queryState,
                occupationFirstLevels: [...queryState.occupationFirstLevels, action.value],
            };
        case REMOVE_OCCUPATION_FIRST_LEVEL:
            return {
                ...queryState,
                occupationFirstLevels: queryState.occupationFirstLevels.filter((obj) => obj !== action.value),
                occupationSecondLevels: queryState.occupationSecondLevels.filter(
                    (obj) => !obj.startsWith(`${action.value}.`),
                ),
            };
        case ADD_OCCUPATION_SECOND_LEVEL:
            return {
                ...queryState,
                occupationSecondLevels: [...queryState.occupationSecondLevels, action.value],
            };
        case REMOVE_OCCUPATION_SECOND_LEVEL:
            return {
                ...queryState,
                occupationSecondLevels: queryState.occupationSecondLevels.filter((obj) => obj !== action.value),
            };
        case ADD_ENGAGEMENT_TYPE:
            return {
                ...queryState,
                engagementType: [...queryState.engagementType, action.value],
            };
        case REMOVE_ENGAGEMENT_TYPE:
            return {
                ...queryState,
                engagementType: queryState.engagementType.filter((obj) => obj !== action.value),
            };
        case ADD_EXTENT:
            return {
                ...queryState,
                extent: [...queryState.extent, action.value],
            };
        case REMOVE_EXTENT:
            return {
                ...queryState,
                extent: queryState.extent.filter((obj) => obj !== action.value),
            };
        case ADD_REMOTE:
            return {
                ...queryState,
                remote: [...queryState.remote, action.value],
            };
        case REMOVE_REMOTE:
            return {
                ...queryState,
                remote: queryState.remote.filter((obj) => obj !== action.value),
            };
        case ADD_SECTOR:
            return {
                ...queryState,
                sector: [...queryState.sector, action.value],
            };
        case REMOVE_SECTOR:
            return {
                ...queryState,
                sector: queryState.sector.filter((obj) => obj !== action.value),
            };
        case SET_PUBLISHED:
            return {
                ...queryState,
                published: action.value,
            };
        case SET_SEARCH_STRING:
            let sort;
            if (queryState.sort !== "expires") {
                if (action.fields === "occupation") {
                    sort = "published";
                } else if (action.value) {
                    sort = "relevant";
                } else {
                    sort = "";
                }
            } else {
                sort = queryState.sort;
            }

            return {
                ...queryState,
                q: action.value,
                fields: action.fields,
                sort,
            };
        case SET_SORTING:
            return {
                ...queryState,
                sort: action.value,
            };
        case SET_FROM:
            return {
                ...queryState,
                from: action.value,
                size: SEARCH_CHUNK_SIZE,
            };
        case RESET:
            return defaultQuery;
        default:
            return queryState;
    }
}

/**
 * Returns a search query optimized for backend api call
 */
export function toApiQuery(query) {
    const apiSearchQuery = {
        ...query,
        sort: query.sort === "" ? "published" : query.sort,
    };
    return removeEmptyPropertiesFromQuery(apiSearchQuery);
}

/**
 * Returns a search query optimized for saved searches
 */
export function toSavedSearchQuery(query) {
    const savedSearchQuery = {
        ...query,
    };

    delete savedSearchQuery.from;
    delete savedSearchQuery.size;
    delete savedSearchQuery.sort;

    return removeEmptyPropertiesFromQuery(savedSearchQuery);
}

/**
 * Returns a search query optimized for browser url
 */
export function toBrowserQuery(query) {
    const browserQuery = {
        ...query,
    };

    if (query.from + query.size > SEARCH_CHUNK_SIZE) {
        browserQuery.to = query.from + query.size;
    }

    delete browserQuery.from;
    delete browserQuery.size;
    return removeEmptyPropertiesFromQuery(browserQuery);
}

/**
 * Takes the query, and returns a comma separated and readable text.
 * For example: "Oslo, IT, Nye i dag"
 * @param query
 * @returns {string}
 */
export function toReadableQuery(query) {
    const title = [];

    // Ikke vis 'Utland' hvis bruker har valgt ett eller flere land
    const counties = query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });

    // Ikke vis yrke på nivå 1 hvis bruker har valgt et relatert yrke på nivå 2
    const occupationFirstLevels = query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });

    if (query.q) title.push(query.q);
    if (occupationFirstLevels.length > 0) title.push(occupationFirstLevels.join(", "));
    if (query.occupationSecondLevels.length > 0)
        title.push(query.occupationSecondLevels.map((o) => o.split(".")[1]).join(", "));
    if (counties.length > 0) title.push(counties.map((c) => fixLocationName(c)).join(", "));
    if (query.municipals.length > 0)
        title.push(query.municipals.map((m) => fixLocationName(m.split(".")[1])).join(", "));
    if (query.extent.length > 0) title.push(query.extent.join(", "));
    if (query.engagementType.length > 0) title.push(query.engagementType.join(", "));
    if (query.sector.length > 0) title.push(query.sector.join(", "));
    if (query.countries.length > 0) title.push(query.countries.map((c) => fixLocationName(c)).join(", "));
    if (query.published) title.push(PublishedLabelsEnum[query.published]);
    if (query.remote.length > 0) title.push("Hjemmekontor");
    if (query.international && query.countries.length === 0) title.push("Utland");

    return title.join(", ");
}

/**
 * Check if query contains one or more criteria
 */
export function isSearchQueryEmpty(query) {
    const queryWithoutEmptyProperties = removeEmptyPropertiesFromQuery(query);
    return Object.keys(queryWithoutEmptyProperties).length === 0;
}

/**
 * Takes a query object, f.ex {"q":"javascript","counties":["OSLO"]},
 * and returns an encoded query string, f.ex "?q=javascript&counties[]=OSLO".
 */
export function stringifyQuery(query = {}) {
    const string = Object.keys(query)
        .map((key) => {
            const value = query[key];
            if (Array.isArray(value)) {
                return value.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join("&");
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`;
        })
        .filter((elem) => elem !== "")
        .join("&");

    if (string.length > 0) {
        return `?${string}`;
    }
    return "";
}
