import capitalizeFirstLetter from "@/app/_common/utils/capitalizeFirstLetter";
import fixLocationName from "@/app/_common/utils/fixLocationName";
import * as Sentry from "@sentry/nextjs";

export const SEARCH_CHUNK_SIZE = 25;
export const ALLOWED_NUMBER_OF_RESULTS_PER_PAGE = [SEARCH_CHUNK_SIZE, SEARCH_CHUNK_SIZE * 4];

export const PublishedLabelsEnum = {
    "now/d": "Nye i dag",
};

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
    workLanguage: [],
    match: undefined,
};

function decodeQueryParameters(encodedQueryParameters) {
    let decodeQueryString = encodedQueryParameters;

    // After login, the redirect url back to this page may have been encoded several times.
    // This function decodes url until it is no longer contains '%', for example %20 (space).
    // When url is fully decoded, it can try to decode again if the url
    // contains the percentage sign itself, and decode attempt will fail.
    // This can happen for example when searching for part-time job '?=50%'.
    for (let key in decodeQueryString) {
        while (decodeQueryString[key].includes("%")) {
            try {
                decodeQueryString[key] = decodeURIComponent(decodeQueryString[key]);
            } catch (err) {
                Sentry.captureException(err, `Failed to decode parameter: ${key}`);
                break;
            }
        }
    }
    return decodeQueryString;
}

// eslint-disable-next-line import/prefer-default-export
export function createQuery(searchParams) {
    const decodedQueryParams = decodeQueryParameters(searchParams);
    return {
        from: decodedQueryParams.from ? parseInt(decodedQueryParams.from, 10) : 0,
        size:
            decodedQueryParams.size &&
            ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(parseInt(decodedQueryParams.size, 10))
                ? parseInt(decodedQueryParams.size, 10)
                : defaultQuery.size,
        q: decodedQueryParams.q || defaultQuery.q,
        match: decodedQueryParams.match || defaultQuery.match,
        municipals: asArray(decodedQueryParams["municipals[]"]) || defaultQuery.municipals,
        counties: asArray(decodedQueryParams["counties[]"]) || defaultQuery.counties,
        countries: asArray(decodedQueryParams["countries[]"]) || defaultQuery.countries,
        international: decodedQueryParams.international === "true",
        remote: asArray(decodedQueryParams["remote[]"]) || defaultQuery.remote,
        occupationFirstLevels:
            asArray(decodedQueryParams["occupationFirstLevels[]"]) || defaultQuery.occupationFirstLevels,
        occupationSecondLevels:
            asArray(decodedQueryParams["occupationSecondLevels[]"]) || defaultQuery.occupationSecondLevels,
        published: decodedQueryParams.published || defaultQuery.published,
        extent: asArray(decodedQueryParams["extent[]"]) || defaultQuery.extent,
        engagementType: asArray(decodedQueryParams["engagementType[]"]) || defaultQuery.engagementType,
        sector: asArray(decodedQueryParams["sector[]"]) || defaultQuery.sector,
        workLanguage: asArray(decodedQueryParams["workLanguage[]"]) || defaultQuery.workLanguage,
        sort: decodedQueryParams.sort || defaultQuery.sort,
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

    return newObj;
}

/**
 * Returns a search query optimized for backend api call
 */
export function toApiQuery(query) {
    const apiSearchQuery = {
        ...query,
        sort: query.sort === "" ? "published" : query.sort,
    };
    return removeUnwantedOrEmptySearchParameters(apiSearchQuery);
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

    return removeUnwantedOrEmptySearchParameters(savedSearchQuery);
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

/**
 * Takes the query, and returns a readable text.
 * For example: "Utvikling i Oslo og Lillestrøm"
 * @param query
 * @returns {string}
 */
export function toReadableQuery(query) {
    const title = [];
    const occupation = [];
    let location = [];

    // Ikke vis fylket hvis bruker har valgt en eller flere tilhørende kommuner
    const counties = query.counties.filter((county) => {
        const found = query.municipals.find((obj) => obj.startsWith(`${county}.`));
        return !found;
    });

    // Ikke vis yrket på nivå 1 hvis bruker har valgt et relatert yrke på nivå 2
    const occupationFirstLevels = query.occupationFirstLevels.filter((firstLevel) => {
        const found = query.occupationSecondLevels.find((obj) => obj.startsWith(`${firstLevel}.`));
        return !found;
    });

    if (query.q) occupation.push(capitalizeFirstLetter(query.q));
    if (query.published) occupation.push(PublishedLabelsEnum[query.published]);

    // occupation
    if (occupationFirstLevels.length > 0) occupation.push(occupationFirstLevels.join(", "));
    if (query.occupationSecondLevels.length > 0)
        occupation.push(query.occupationSecondLevels.map((o) => o.split(".")[1]).join(", "));
    if (query.sector.length > 0) occupation.push(query.sector.join(", "));
    if (query.extent.length > 0) occupation.push(query.extent.join(", "));
    if (query.engagementType.length > 0) occupation.push(query.engagementType.join(", "));
    if (query.remote.length > 0) occupation.push("Hjemmekontor");

    // location
    if (counties.length > 0) {
        location = location.concat(counties.map((c) => fixLocationName(c)));
    }
    if (query.municipals.length > 0) {
        location = location.concat(query.municipals.map((m) => fixLocationName(m.split(".")[1])));
    }
    if (query.countries.length > 0) {
        location = location.concat(query.countries.map((c) => fixLocationName(c)));
    }
    if (query.international && query.countries.length === 0) {
        location.push("Utland");
    }

    if (occupation.length > 0) {
        title.push(occupation.join(", "));
    }

    if (location.length > 0) {
        const last = location.pop();
        if (location.length > 0) {
            title.push([location.join(", "), last].join(" og "));
        } else {
            title.push(last);
        }
    }
    return title.join(" i ");
}

/**
 * Check if query contains one or more criteria
 */
export function isSearchQueryEmpty(query) {
    const queryWithoutEmptyProperties = removeUnwantedOrEmptySearchParameters(query);
    return Object.keys(queryWithoutEmptyProperties).length === 0;
}

/**
 * Takes a query object, f.ex {"q":"javascript","counties":["OSLO"]},
 * and returns an encoded query string, f.ex "?q=javascript&counties[]=OSLO".
 */
export function stringifyQuery(query = {}) {
    const decodedQuery = decodeQueryParameters(query);
    const string = Object.keys(decodedQuery)
        .map((key) => {
            const value = decodedQuery[key];
            if (Array.isArray(value)) {
                return value.map((val) => `${encodeURIComponent(key)}[]=${encodeURIComponent(val)}`).join("&");
            }
            return `${encodeURIComponent(key)}=${encodeURIComponent(decodedQuery[key])}`;
        })
        .filter((elem) => elem !== "")
        .join("&");

    if (string.length > 0) {
        return `?${string}`;
    }
    return "";
}
