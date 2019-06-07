import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import {
    FETCH_INITIAL_FACETS_SUCCESS,
    RESET_SEARCH,
    SEARCH_SUCCESS,
    SET_FACET_PANELS_INITIAL_CLOSED
} from '../../searchReducer';
import { findDeprecatedFacets } from '../utils';

export const CHECK_COUNTRIES = 'CHECK_COUNTRIES';
export const UNCHECK_COUNTRIES = 'UNCHECK_COUNTRIES';
export const TOGGLE_COUNTRIES_PANEL_OPEN = 'TOGGLE_COUNTRIES_PANEL_OPEN';

const initialState = {
    countries: [],
    checkedCountries: [],
    deprecatedCountries: [],
    countriesPanelOpen: true
};

export default function countriesReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedCountries = action.query.countries || [];
            return {
                ...state,
                checkedCountries,
                deprecatedCountries: findDeprecatedFacets(checkedCountries, state.countries)
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedCountries: [],
                deprecatedCountries: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                countries: action.response.countries,
                deprecatedCountries: findDeprecatedFacets(state.checkedCountries, action.response.countries)
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                countries: state.countries.map((item) => {
                    const found = action.response.countries.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_COUNTRIES:
            return {
                ...state,
                checkedCountries: [
                    ...state.checkedCountries,
                    action.value
                ]
            };
        case UNCHECK_COUNTRIES:
            return {
                ...state,
                checkedCountries: state.checkedCountries.filter((m) => (m !== action.value))
            };
        case TOGGLE_COUNTRIES_PANEL_OPEN:
            return {
                ...state,
                countriesPanelOpen: !state.countriesPanelOpen
            };
        case SET_FACET_PANELS_INITIAL_CLOSED:
            return {
                ...state,
                countriesPanelOpen: false
            };
        default:
            return state;
    }
}
