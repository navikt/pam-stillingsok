import { SET_INITIAL_STATE, FETCH_INITIAL_FACETS_SUCCESS, SEARCH_SUCCESS } from '../../searchReducer';
import { moveFacetToBottom} from "../../../utils";

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';

const initialState = {
    sector: [],
    checkedSector: []
};

export default function sectorReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedSector: action.query.sector || []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                sector: moveFacetToBottom (action.response.sector, 'Ikke oppgitt')
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
