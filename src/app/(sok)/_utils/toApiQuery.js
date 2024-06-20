import {
    ALLOWED_NUMBER_OF_RESULTS_PER_PAGE,
    SearchQueryParams,
    SEARCH_RESULTS_PER_PAGE,
} from "@/app/(sok)/_utils/constants";

export const defaultApiQuery = {
    q: "",
    from: "0",
    size: SEARCH_RESULTS_PER_PAGE,
    counties: [],
    countries: [],
    needDriversLicense: [],
    education: [],
    engagementType: [],
    extent: [],
    remote: [],
    municipals: [],
    occupations: [],
    occupationFirstLevels: [],
    occupationSecondLevels: [],
    published: undefined,
    sector: [],
    sort: "",
    international: false,
    workLanguage: [],
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

/**
 * Takes an searchParams object and returns a search query object for backend api call
 */
export default function toApiQuery(searchParams) {
    return {
        from: searchParams[SearchQueryParams.FROM] ? searchParams[SearchQueryParams.FROM] : defaultApiQuery.from,
        size:
            searchParams[SearchQueryParams.SIZE] &&
            ALLOWED_NUMBER_OF_RESULTS_PER_PAGE.includes(parseInt(searchParams[SearchQueryParams.SIZE], 10))
                ? parseInt(searchParams[SearchQueryParams.SIZE], 10)
                : defaultApiQuery.size,
        q: searchParams[SearchQueryParams.Q] || defaultApiQuery.q,
        municipals: asArray(searchParams[SearchQueryParams.MUNICIPAL]) || defaultApiQuery.municipals,
        counties: asArray(searchParams[SearchQueryParams.COUNTY]) || defaultApiQuery.counties,
        countries: asArray(searchParams[SearchQueryParams.COUNTRY]) || defaultApiQuery.countries,
        international: searchParams[SearchQueryParams.INTERNATIONAL] === "true",
        remote: asArray(searchParams[SearchQueryParams.REMOTE]) || defaultApiQuery.remote,
        occupations: asArray(searchParams[SearchQueryParams.OCCUPATION]) || defaultApiQuery.occupations,
        occupationFirstLevels:
            asArray(searchParams[SearchQueryParams.OCCUPATION_LEVEL_1]) || defaultApiQuery.occupationFirstLevels,
        occupationSecondLevels:
            asArray(searchParams[SearchQueryParams.OCCUPATION_LEVEL_2]) || defaultApiQuery.occupationSecondLevels,
        published: searchParams[SearchQueryParams.PUBLISHED] || defaultApiQuery.published,
        needDriversLicense:
            asArray(searchParams[SearchQueryParams.NEED_DRIVERS_LICENSE]) || defaultApiQuery.needDriversLicense,
        extent: asArray(searchParams[SearchQueryParams.EXTENT]) || defaultApiQuery.extent,
        engagementType: asArray(searchParams[SearchQueryParams.ENGAGEMENT_TYPE]) || defaultApiQuery.engagementType,
        sector: asArray(searchParams[SearchQueryParams.SECTOR]) || defaultApiQuery.sector,
        education: asArray(searchParams[SearchQueryParams.EDUCATION]) || defaultApiQuery.education,
        workLanguage: asArray(searchParams[SearchQueryParams.WORK_LANGUAGE]) || defaultApiQuery.workLanguage,
        sort: searchParams[SearchQueryParams.SORT] || defaultApiQuery.sort,
    };
}
