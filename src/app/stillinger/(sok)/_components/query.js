import { SEARCH_CHUNK_SIZE } from "./old_query";

function asArray(value) {
    if (Array.isArray(value)) {
        return value;
    }
    if (value) {
        return [value];
    }
    return [];
}

// eslint-disable-next-line import/prefer-default-export
export function createQuery(initialState, searchParams) {
    return {
        from: 0,
        size: searchParams.to ? parseInt(searchParams.to, 10) : SEARCH_CHUNK_SIZE,
        q: searchParams.q || initialState.q,
        match: searchParams.match || initialState.match,
        municipals: asArray(searchParams["municipals[]"]) || initialState.municipals,
        counties: asArray(searchParams["counties[]"]) || initialState.counties,
        countries: asArray(searchParams["countries[]"]) || initialState.countries,
        international: searchParams.international === true,
        remote: asArray(searchParams["remote[]"]) || initialState.remote,
        occupationFirstLevels: asArray(searchParams["occupationFirstLevels[]"]) || initialState.occupationFirstLevels,
        occupationSecondLevels:
            asArray(searchParams["occupationSecondLevels[]"]) || initialState.occupationSecondLevels,
        published: searchParams.published || initialState.published,
        extent: asArray(searchParams["extent[]"]) || initialState.extent,
        engagementType: asArray(searchParams["engagementType[]"]) || initialState.engagementType,
        sector: asArray(searchParams["sector[]"]) || initialState.sector,
        workLanguage: asArray(searchParams["workLanguage[]"]) || initialState.workLanguage,
        sort: searchParams.sort || initialState.sort,
    };
}
