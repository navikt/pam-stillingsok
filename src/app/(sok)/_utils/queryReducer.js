import { defaultQuery } from "./query";

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
export const ADD_WORKLANGUAGE = "ADD_WORKLANGUAGE";
export const REMOVE_WORKLANGUAGE = "REMOVE_WORKLANGUAGE";
export const ADD_EDUCATION = "ADD_EDUCATION";
export const REMOVE_EDUCATION = "REMOVE_EDUCATION";
export const ADD_REMOTE = "ADD_REMOTE";
export const REMOVE_REMOTE = "REMOVE_REMOTE";
export const ADD_SECTOR = "ADD_SECTOR";
export const REMOVE_SECTOR = "REMOVE_SECTOR";
export const SET_PUBLISHED = "SET_PUBLISHED";
export const SET_SEARCH_STRING = "SET_SEARCH_STRING";
export const SET_SORTING = "SET_SORTING";
export const SET_INTERNATIONAL = "SET_INTERNATIONAL";
export const RESET = "RESET";
export const SET_FROM_AND_SIZE = "SET_FROM_AND_SIZE";

function getSort(previousSort, searchString, searchFields) {
    if (previousSort !== "expires") {
        if (searchFields === "occupation") {
            return "published";
        }
        if (searchString) {
            return "relevant";
        }
        return "";
    }
    return previousSort;
}

export default function queryReducer(state, action) {
    // Reset pagination when user add or remove a search criteria
    const queryState = {
        ...state,
        from: 0,
        paginate: undefined,
    };

    switch (action.type) {
        case SET_INTERNATIONAL:
            return {
                ...queryState,
                international: action.value,
            };
        case ADD_COUNTY:
            if (queryState.counties.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.municipals.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.countries.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.occupationFirstLevels.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.occupationSecondLevels.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.engagementType.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.extent.includes(action.value)) {
                return queryState;
            }
            return {
                ...queryState,
                extent: [...queryState.extent, action.value],
            };
        case REMOVE_EXTENT:
            return {
                ...queryState,
                extent: queryState.extent.filter((obj) => obj !== action.value),
            };
        case ADD_WORKLANGUAGE:
            if (queryState.workLanguage.includes(action.value)) {
                return queryState;
            }
            return {
                ...queryState,
                workLanguage: [...queryState.workLanguage, action.value],
            };
        case REMOVE_WORKLANGUAGE:
            return {
                ...queryState,
                workLanguage: queryState.workLanguage.filter((obj) => obj !== action.value),
            };

        case ADD_EDUCATION:
            if (queryState.education.includes(action.value)) {
                return queryState;
            }
            return {
                ...queryState,
                education: [...queryState.education, action.value],
            };
        case REMOVE_EDUCATION:
            return {
                ...queryState,
                education: queryState.education.filter((obj) => obj !== action.value),
            };
        case ADD_REMOTE:
            if (queryState.remote.includes(action.value)) {
                return queryState;
            }
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
            if (queryState.sector.includes(action.value)) {
                return queryState;
            }
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
            return {
                ...queryState,
                q: action.value,
                fields: action.fields,
                sort: getSort(queryState.sort, action.value, action.fields),
            };
        case SET_SORTING:
            return {
                ...queryState,
                sort: action.value,
            };
        case SET_FROM_AND_SIZE:
            return {
                ...queryState,
                from: action.from,
                size: action.size,
                paginate: true,
            };
        case RESET:
            return {
                ...defaultQuery,
                size: queryState.size,
            };
        default:
            return queryState;
    }
}
