import locations from "@/app/stillinger/(sok)/_utils/tmpABTestLocations";
import { CURRENT_VERSION } from "@/app/stillinger/(sok)/_utils/versioning/searchParamsVersioning";

export const SEARCH_CHUNK_SIZE = 25;
export const MAX_RESULT_WINDOW = 10_000;
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
    let result: number;

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

const knownExtentValues = ["Heltid", "Deltid"];

function containsWord(text: string, word: string) {
    return text.toLowerCase().split(" ").includes(word.toLowerCase());
}

function removeWord(text: string, toBeRemoved: string) {
    const words = text.split(" ");
    const newWords = words.map((word) => (word.toLowerCase() === toBeRemoved.toLowerCase() ? "" : word));
    return newWords.join(" ").trim();
}

function getSearchString(apiSearchQuery: SearchQuery) {
    return apiSearchQuery.q ? apiSearchQuery.q.join(" ") : "";
}

export function tmpToApiQuery(query: SearchQuery): SearchQuery {
    const apiSearchQuery = {
        ...query,
    };

    knownExtentValues.forEach((extent) => {
        const searchString = getSearchString(apiSearchQuery);
        if (containsWord(searchString, extent)) {
            if (!apiSearchQuery.extent?.includes(extent)) {
                apiSearchQuery.extent = [...(apiSearchQuery.extent || []), extent];
            }
            apiSearchQuery.q = [removeWord(searchString, extent)];
        }
    });

    locations.forEach((county) => {
        const searchString = getSearchString(apiSearchQuery);
        if (containsWord(searchString, county.key)) {
            if (!apiSearchQuery.counties?.includes(county.key)) {
                apiSearchQuery.counties = [...(apiSearchQuery.counties || []), county.key];
            }
            apiSearchQuery.q = [removeWord(searchString, county.key)];
        }

        county.m.forEach((municipal) => {
            const searchString = getSearchString(apiSearchQuery);
            if (containsWord(searchString, municipal)) {
                if (!apiSearchQuery.municipals?.includes(`${county.key}.${municipal}`)) {
                    apiSearchQuery.municipals = [...(apiSearchQuery.municipals || []), `${county.key}.${municipal}`];
                    if (!apiSearchQuery.counties?.includes(county.key)) {
                        apiSearchQuery.counties = [...(apiSearchQuery.counties || []), county.key];
                    }
                }
                apiSearchQuery.q = [removeWord(searchString, municipal)];
            }
        });
    });

    if (apiSearchQuery.q && apiSearchQuery.q.length === 1 && apiSearchQuery.q[0] === "") {
        delete apiSearchQuery.q;
    }

    // Postcode and distance are only relevant to search for if both are set
    if (!(apiSearchQuery.postcode && apiSearchQuery.postcode.length === 4 && apiSearchQuery.distance)) {
        delete apiSearchQuery.postcode;
        delete apiSearchQuery.distance;
    }

    console.log(apiSearchQuery);
    return apiSearchQuery;
}
