import { SET_INITIAL_STATE, INITIAL_SEARCH_SUCCESS, SEARCH_SUCCESS } from '../../searchSagas';

export const CHECK_EXTENT = 'CHECK_EXTENT';
export const UNCHECK_EXTENT = 'UNCHECK_EXTENT';

const initialState = {
    extent: [],
    checkedExtent: []
};

export default function extentReducer(state = initialState, action) {
    switch (action.type) {
        case SET_INITIAL_STATE:
            return {
                ...state,
                checkedExtent: action.query.extent || []
            };
        case INITIAL_SEARCH_SUCCESS:
            return {
                ...state,
                extent: action.response.extent
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
        default:
            return state;
    }
}
