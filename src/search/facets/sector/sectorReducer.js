import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';
import { moveFacetToBottom } from '../utils';

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';

const initialState = {
    sector: [],
    checkedSector: [],
    deprecatedSector: []
};

export default function sectorReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            return {
                ...state,
                checkedSector: action.query.sector || []
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedSector: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                sector: moveFacetToBottom(action.response.sector, 'Ikke oppgitt')
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
                }),
                deprecatedSector: state.checkedSector.map((sector) => (
                    !state.sector.map((s) => s.key).includes(sector) ? sector : undefined
                )).filter((s) => s !== undefined)
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
