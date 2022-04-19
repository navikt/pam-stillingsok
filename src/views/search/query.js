import { decodeUrl, parseQueryString } from "../../components/utils";
import fixLocationName from "../../../server/common/fixLocationName";
import { PublishedLabelsEnum } from "./searchCriteria/Published";

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

export const initialQuery = {
    q: "",
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
    international: false
};

/**
 * Hvis bruker åpner en lenke med søkeparametere, for eksempel et lagret søk,
 * eller bare refresher browseren, så skal dette søket gjenskapes.
 */
export function initQueryWithValuesFromBrowserUrl(initialState) {
    const decodedUrl = decodeUrl(document.location.search);
    const fromBrowserUrl = parseQueryString(decodedUrl);
    return {
        from: 0,
        size: fromBrowserUrl.to ? parseInt(fromBrowserUrl.to, 10) : SEARCH_CHUNK_SIZE,
        q: fromBrowserUrl.q || initialState.q,
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
        sort: fromBrowserUrl.sort || initialState.sort
    };
}

export default function queryReducer(state, action) {
    // Reset pagination when user add or remove a search criteria
    state = {
        ...state,
        from: 0,
        size: SEARCH_CHUNK_SIZE
    };

    switch (action.type) {
        case SET_INTERNATIONAL:
            return {
                ...state,
                international: action.value
            };
        case ADD_COUNTY:
            return {
                ...state,
                counties: [...state.counties, action.value]
            };
        case REMOVE_COUNTY:
            return {
                ...state,
                counties: state.counties.filter((obj) => obj !== action.value),
                municipals: state.municipals.filter((obj) => !obj.startsWith(`${action.value}.`))
            };
        case ADD_MUNICIPAL:
            return {
                ...state,
                municipals: [...state.municipals, action.value]
            };
        case REMOVE_MUNICIPAL:
            return {
                ...state,
                municipals: state.municipals.filter((obj) => obj !== action.value)
            };
        case ADD_COUNTRY:
            return {
                ...state,
                countries: [...state.countries, action.value]
            };
        case REMOVE_COUNTRY:
            return {
                ...state,
                countries: state.countries.filter((obj) => obj !== action.value)
            };
        case ADD_OCCUPATION_FIRST_LEVEL:
            return {
                ...state,
                occupationFirstLevels: [...state.occupationFirstLevels, action.value]
            };
        case REMOVE_OCCUPATION_FIRST_LEVEL:
            return {
                ...state,
                occupationFirstLevels: state.occupationFirstLevels.filter((obj) => obj !== action.value),
                occupationSecondLevels: state.occupationSecondLevels.filter(
                    (obj) => !obj.startsWith(`${action.value}.`)
                )
            };
        case ADD_OCCUPATION_SECOND_LEVEL:
            return {
                ...state,
                occupationSecondLevels: [...state.occupationSecondLevels, action.value]
            };
        case REMOVE_OCCUPATION_SECOND_LEVEL:
            return {
                ...state,
                occupationSecondLevels: state.occupationSecondLevels.filter((obj) => obj !== action.value)
            };
        case ADD_ENGAGEMENT_TYPE:
            return {
                ...state,
                engagementType: [...state.engagementType, action.value]
            };
        case REMOVE_ENGAGEMENT_TYPE:
            return {
                ...state,
                engagementType: state.engagementType.filter((obj) => obj !== action.value)
            };
        case ADD_EXTENT:
            return {
                ...state,
                extent: [...state.extent, action.value]
            };
        case REMOVE_EXTENT:
            return {
                ...state,
                extent: state.extent.filter((obj) => obj !== action.value)
            };
        case ADD_REMOTE:
            return {
                ...state,
                remote: [...state.remote, action.value]
            };
        case REMOVE_REMOTE:
            return {
                ...state,
                remote: state.remote.filter((obj) => obj !== action.value)
            };
        case ADD_SECTOR:
            return {
                ...state,
                sector: [...state.sector, action.value]
            };
        case REMOVE_SECTOR:
            return {
                ...state,
                sector: state.sector.filter((obj) => obj !== action.value)
            };
        case SET_PUBLISHED:
            return {
                ...state,
                published: action.value
            };
        case SET_SEARCH_STRING:
            return {
                ...state,
                q: action.value
            };
        case SET_SORTING:
            return {
                ...state,
                sort: action.value
            };
        case SET_FROM:
            return {
                ...state,
                from: action.value,
                size: SEARCH_CHUNK_SIZE
            };
        case RESET:
            return initialQuery;
        default:
            return state;
    }
}

/**
 * Takes an object an return a new object without empty properties.
 * An empty property can be an undefined value, an empty string or an empty array.
 */
function removeEmptyProperties(obj) {
    const newObj = {};
    Object.keys(obj).forEach((prop) => {
        const value = obj[prop];

        if (prop === "international" && value === false) {
            // behøver ikke ta med international flag om det er false
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
 * Returnerer searchQuery optimimalisert for backend api-kall
 * @param query
 */
export function toApiQuery(query) {
    return removeEmptyProperties(query);
}

/**
 * Returnerer searchQuery optimimalisert for lagrede søk
 * @param query
 */
export function toSavedSearchQuery(query) {
    const savedSearchQuery = {
        ...query
    };

    // Når man lagrer et søk dropper vi paginering og sortering
    delete savedSearchQuery.from;
    delete savedSearchQuery.size;
    delete savedSearchQuery.sort;

    return removeEmptyProperties(savedSearchQuery);
}

/**
 * Returnerer searchQuery optimimalisert for browser url'en
 */
export function toBrowserQuery(query) {
    const browserQuery = {
        ...query
    };

    if (query.from + query.size > SEARCH_CHUNK_SIZE) {
        browserQuery.to = query.from + query.size;
    }

    delete browserQuery.from;
    delete browserQuery.size;
    return removeEmptyProperties(browserQuery);
}

/**
 * Returnerer searchQuery som en komma-separert og lesbar tekst.
 * For example: "Oslo, Hordaland, IT, Nye i dag"
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
 * Sjekker om bruker av valgt et eller flere søkekriterier
 */
export function isSearchQueryEmpty(query) {
    const queryWithoutEmptyProperties = removeEmptyProperties(query);
    return Object.keys(queryWithoutEmptyProperties).length === 0;
}
