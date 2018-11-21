import { RESTORE_STATE_FROM_SAVED_SEARCH } from '../../../savedSearches/savedSearchesReducer';
import { RESTORE_STATE_FROM_URL } from '../../../urlReducer';
import { FETCH_INITIAL_FACETS_SUCCESS, RESET_SEARCH, SEARCH_SUCCESS } from '../../searchReducer';

export const CHECK_EXTENT = 'CHECK_EXTENT';
export const UNCHECK_EXTENT = 'UNCHECK_EXTENT';

export const UNCHECK_DEPRECATED_EXTENT = 'UNCHECK_DEPRECATED_EXTENT';

const initialState = {
    extent: [],
    checkedExtent: [],
    deprecatedExtent: []
};

const findDeprecatedExtent = (checkedExtent, extent) =>
    checkedExtent.filter((ext) => !extent.map((e) => e.key).includes(ext));

export default function extentReducer(state = initialState, action) {
    switch (action.type) {
        case RESTORE_STATE_FROM_URL:
        case RESTORE_STATE_FROM_SAVED_SEARCH:
            const checkedExtent = action.query.extent || [];
            return {
                ...state,
                checkedExtent,
                deprecatedExtent: findDeprecatedExtent(checkedExtent, state.extent)
            };
        case RESET_SEARCH:
            return {
                ...state,
                checkedExtent: [],
                deprecatedExtent: []
            };
        case FETCH_INITIAL_FACETS_SUCCESS:
            return {
                ...state,
                extent: action.response.extent,
                deprecatedExtent: findDeprecatedExtent(state.checkedExtent, action.response.extent)
            };
        case SEARCH_SUCCESS:
            return {
                ...state,
                extent: state.extent.map((item) => {
                    const found = action.response.extent.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case CHECK_EXTENT:
            return {
                ...state,
                checkedExtent: [
                    ...state.checkedExtent,
                    action.value
                ]
            };
        case UNCHECK_EXTENT:
            return {
                ...state,
                checkedExtent: state.checkedExtent.filter((m) => (m !== action.value))
            };
        case UNCHECK_DEPRECATED_EXTENT:
            return {
                ...state,
                checkedExtent: state.checkedExtent.filter((e) => e !== action.deprecated)
            };
        default:
            return state;
    }
}
