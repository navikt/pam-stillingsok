import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';

export const CHECK_COUNTY = 'CHECK_COUNTY';
export const UNCHECK_COUNTY = 'UNCHECK_COUNTY';
export const CHECK_MUNICIPAL = 'CHECK_MUNICIPAL';
export const UNCHECK_MUNICIPAL = 'UNCHECK_MUNICIPAL';

export const UNCHECK_DEPRECATED_LOCATION = 'UNCHECK_DEPRECATED_LOCATION';

const initialState = {
    counties: [],
    checkedCounties: [],
    checkedMunicipals: [],
    deprecatedCounties: [],
    deprecatedMunicipals: []
};

const findDeprecatedCounties = (checkedCounties, counties) =>
    checkedCounties.filter((checkedCounty) => !counties.map((c) => c.key).includes(checkedCounty));

const findDeprecatedMunicipals = (checkedMunicipals, counties) => (
    checkedMunicipals.map((checkedMunicipal) => {
        const municipal = checkedMunicipal.split('.');
        const county = counties.find((c) => c.key === municipal[0]);
        if (county) {
            return !county.municipals.map((m) => m.key).includes(checkedMunicipal)
                ? checkedMunicipal
                : undefined;
        }
        return checkedMunicipal;
    }).filter((m) => m !== undefined)
);

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
                deprecatedCounties: findDeprecatedCounties(checkedCounties, state.counties),
                deprecatedMunicipals: findDeprecatedMunicipals(checkedMunicipals, state.counties)
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
                deprecatedCounties: findDeprecatedCounties(state.checkedCounties, action.response.counties),
                deprecatedMunicipals: findDeprecatedMunicipals(state.checkedMunicipals, action.response.counties)
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
            const countyObject = state.counties.find((c) => c.key === action.county);
            return {
                ...state,
                checkedCounties: state.checkedCounties.filter((c) => (c !== action.county)),
                checkedMunicipals: state.checkedMunicipals ? state.checkedMunicipals.filter((m1) =>
                    !countyObject.municipals.find((m) => m.key === m1)) : [],
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
        case UNCHECK_DEPRECATED_LOCATION:
            if (state.checkedCounties.includes(action.deprecated)) {
                return {
                    ...state,
                    checkedCounties: state.checkedCounties.filter((c) => c !== action.deprecated)
                };
            } else if (state.checkedMunicipals.includes(action.deprecated)) {
                return {
                    ...state,
                    checkedMunicipals: state.checkedMunicipals.filter((c) => c !== action.deprecated)
                };
            }
            return {
                ...state
            };
        default:
            return state;
    }
}
