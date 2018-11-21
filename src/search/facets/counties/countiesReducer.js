import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';
import { findDeprecatedFacets } from '../utils';

export const CHECK_COUNTY = 'CHECK_COUNTY';
export const UNCHECK_COUNTY = 'UNCHECK_COUNTY';
export const CHECK_MUNICIPAL = 'CHECK_MUNICIPAL';
export const UNCHECK_MUNICIPAL = 'UNCHECK_MUNICIPAL';

const initialState = {
    counties: [],
    checkedCounties: [],
    checkedMunicipals: [],
    deprecatedCounties: [],
    deprecatedMunicipals: []
};

function uncheckMunicipalsInCounty(state, county) {
    const countyObject = state.counties.find((c) => c.key === county);
    if (!countyObject) {
        return state.checkedMunicipals;
    }

    if (!state.checkedMunicipals) {
        return [];
    }

    return state.checkedMunicipals.filter((m1) =>
        !countyObject.municipals.find((m) => m.key === m1));
}

export default function countiesReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedCounties = action.query.counties || [];
            const checkedMunicipals = action.query.municipals || [];
            return {
                ...state,
                checkedCounties,
                checkedMunicipals,
                deprecatedCounties: findDeprecatedFacets(checkedCounties, state.counties),
                deprecatedMunicipals: findDeprecatedFacets(checkedMunicipals, state.counties, 'municipals')
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedCounties: [],
                checkedMunicipals: [],
                deprecatedCounties: [],
                deprecatedMunicipals: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                counties: action.response.counties,
                deprecatedCounties: findDeprecatedFacets(state.checkedCounties, action.response.counties),
                deprecatedMunicipals: findDeprecatedFacets(state.checkedMunicipals, action.response.counties, 'municipals')
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                counties: state.counties.map((county) => {
                    const foundCounty = action.response.counties.find((c) => (
                        c.key === county.key
                    ));
                    return {
                        ...county,
                        count: foundCounty ? foundCounty.count : 0,
                        municipals: county.municipals.map((municipal) => {
                            let newMunicipalCount = 0;
                            if (foundCounty) {
                                const foundMunicipal = foundCounty.municipals.find((m) => (
                                    m.key === municipal.key
                                ));
                                newMunicipalCount = foundMunicipal ? foundMunicipal.count : 0;
                            }
                            return {
                                ...municipal,
                                count: newMunicipalCount
                            };
                        })
                    };
                })
            };
        case CHECK_COUNTY:
            return {
                ...state,
                checkedCounties: [
                    ...state.checkedCounties,
                    action.county
                ]
            };
        case UNCHECK_COUNTY:
            return {
                ...state,
                checkedCounties: state.checkedCounties.filter((c) => (c !== action.county)),
                checkedMunicipals: uncheckMunicipalsInCounty(state, action.county),
                from: 0
            };
        case CHECK_MUNICIPAL:
            return {
                ...state,
                checkedMunicipals: [
                    ...state.checkedMunicipals,
                    action.municipal
                ]
            };
        case UNCHECK_MUNICIPAL:
            return {
                ...state,
                checkedMunicipals: state.checkedMunicipals.filter((m) => (m !== action.municipal))
            };
        default:
            return state;
    }
}
