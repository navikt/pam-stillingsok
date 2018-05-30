
/** *********************************************************
 * ACTIONS
 ********************************************************* */


export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export const FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS = 'FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS';
export const FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS = 'FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS';

export const FETCH_INITIAL_HELTID_DELTID_SUCCESS = 'FETCH_INITIAL_HELTID_DELTID_SUCCESS';
export const FETCH_HELTID_DELTID_COUNT_SUCCESS = 'FETCH_HELTID_DELTID_COUNT_SUCCESS';

export const FETCH_INITIAL_SECTOR_SUCCESS = 'FETCH_INITIAL_SECTOR_SUCCESS';
export const FETCH_SECTOR_COUNT_SUCCESS = 'FETCH_SECTOR_COUNT_SUCCESS';

export const FETCH_INITIAL_CREATED_SUCCESS = 'FETCH_INITIAL_CREATED_SUCCESS';
export const FETCH_CREATED_COUNT_SUCCESS = 'FETCH_CREATED_COUNT_SUCCESS';

export const SET_TYPE_AHEAD_VALUE = 'SET_TYPE_AHEAD_VALUE';

export const CHECK_ENGAGEMENT_TYPE = 'CHECK_ENGAGEMENT_TYPE';
export const UNCHECK_ENGAGEMENT_TYPE = 'UNCHECK_ENGAGEMENT_TYPE';

export const CHECK_HELTID_DELTID = 'CHECK_HELTID_DELTID';
export const UNCHECK_HELTID_DELTID = 'UNCHECK_HELTID_DELTID';

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';


/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    heltidDeltid: [],
    engagementType: [],
    sector: [],
    created: [],
    query: {
        q: '',
        heltidDeltid: [],
        engagementType: [],
        sector: [],
        created: []
    },
    error: undefined
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS:
            return {
                ...state,
                engagementType: action.response
            };
        case FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS:
            return {
                ...state,
                engagementType: state.engagementType.map((item) => {
                    const found = action.response.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case FETCH_INITIAL_HELTID_DELTID_SUCCESS:
            return {
                ...state,
                heltidDeltid: action.response
            };
        case FETCH_HELTID_DELTID_COUNT_SUCCESS:
            return {
                ...state,
                heltidDeltid: state.heltidDeltid.map((item) => {
                    const found = action.response.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case FETCH_INITIAL_SECTOR_SUCCESS:
            return {
                ...state,
                sector: action.response
            };
        case FETCH_SECTOR_COUNT_SUCCESS:
            return {
                ...state,
                sector: state.sector.map((item) => {
                    const found = action.response.find((e) => (
                        e.key === item.key
                    ));
                    return {
                        ...item,
                        count: found ? found.count : 0
                    };
                })
            };
        case SET_INITIAL_STATE:
            return {
                ...state,
                query: {
                    ...state.query,
                    ...action.query
                }

            };
        case SET_TYPE_AHEAD_VALUE:
            return {
                ...state,
                query: {
                    ...state.query,
                    q: action.value,
                    from: 0
                }
            };
        case CHECK_HELTID_DELTID:
            return {
                ...state,
                query: {
                    ...state.query,
                    heltidDeltid: [
                        ...state.query.heltidDeltid,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_HELTID_DELTID:
            return {
                ...state,
                query: {
                    ...state.query,
                    heltidDeltid: state.query.heltidDeltid.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        case CHECK_ENGAGEMENT_TYPE:
            return {
                ...state,
                query: {
                    ...state.query,
                    engagementType: [
                        ...state.query.engagementType,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_ENGAGEMENT_TYPE:
            return {
                ...state,
                query: {
                    ...state.query,
                    engagementType: state.query.engagementType.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        case CHECK_SECTOR:
            return {
                ...state,
                query: {
                    ...state.query,
                    sector: [
                        ...state.query.sector,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_SECTOR:
            return {
                ...state,
                query: {
                    ...state.query,
                    sector: state.query.sector.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        default:
            return state;
    }
}


