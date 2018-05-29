import { SET_INITIAL_STATE, INITIAL_SEARCH_SUCCESS, SEARCH_SUCCESS } from '../../domene';

export const CHECK_COUNTY = 'CHECK_COUNTY';
export const UNCHECK_COUNTY = 'UNCHECK_COUNTY';
export const CHECK_MUNICIPAL = 'CHECK_MUNICIPAL';
export const UNCHECK_MUNICIPAL = 'UNCHECK_MUNICIPAL';

const initialState = {
    counties: [],
    checkedCounties: [],
    checkedMunicipals: []
};

export default function counties(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedCounties: action.query.counties || [],
                checkedMunicipals: action.query.municipals || []
            };
        case INITIAL_SEARCH_SUCCESS:
            return {
                ...state,
                counties: action.response.counties
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
                checkedMunicipals: state.checkedMunicipals.filter((m1) =>
                    !countyObject.municipals.find((m) => m.key === m1))
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
