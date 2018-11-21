import {
    RESTORE_STATE_FROM_SAVED_SEARCH,
    UPDATE_SAVED_SEARCH_SUCCESS
} from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';
import { findDeprecatedFacets, moveFacetToBottom } from '../utils';

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';

export const UNCHECK_DEPRECATED_SECTOR = 'UNCHECK_DEPRECATED_SECTOR';

const initialState = {
    sector: [],
    checkedSector: [],
    deprecatedSector: []
};

export default function sectorReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedSector = action.query.sector || [];
            return {
                ...state,
                checkedSector,
                deprecatedSector: findDeprecatedFacets(checkedSector, state.sector)
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedSector: [],
                deprecatedSector: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                sector: moveFacetToBottom(action.response.sector, 'Ikke oppgitt'),
                deprecatedSector: findDeprecatedFacets(state.checkedSector, action.response.sector)
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                sector: state.sector.map((item) => {
                    const found = action.response.sector.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_SECTOR:
            return {
                ...state,
                checkedSector: [
                    ...state.checkedSector,
                    action.value
                ]
            };
        case UNCHECK_SECTOR:
            return {
                ...state,
                checkedSector: state.checkedSector.filter((m) => (m !== action.value))
            };
        default:
            return state;
    }
}
