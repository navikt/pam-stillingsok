
/** *********************************************************
 * ACTIONS
 ********************************************************* */


export const SET_INITIAL_STATE = 'SET_INITIAL_STATE';

export const FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS = 'FETCH_INITIAL_ENGAGEMENT_TYPE_SUCCESS';
export const FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS = 'FETCH_ENGAGEMENT_TYPE_COUNT_SUCCESS';

export const FETCH_INITIAL_HELTID_DELTID_SUCCESS = 'FETCH_INITIAL_HELTID_DELTID_SUCCESS';
export const FETCH_HELTID_DELTID_COUNT_SUCCESS = 'FETCH_HELTID_DELTID_COUNT_SUCCESS';

export const FETCH_INITIAL_COUNTIES_SUCCESS = 'FETCH_INITIAL_COUNTIES_SUCCESS';
export const FETCH_COUNTIES_COUNT_SUCCESS = 'FETCH_COUNTIES_COUNT_SUCCESS';

export const FETCH_INITIAL_SECTOR_SUCCESS = 'FETCH_INITIAL_SECTOR_SUCCESS';
export const FETCH_SECTOR_COUNT_SUCCESS = 'FETCH_SECTOR_COUNT_SUCCESS';

export const FETCH_INITIAL_CREATED_SUCCESS = 'FETCH_INITIAL_CREATED_SUCCESS';
export const FETCH_CREATED_COUNT_SUCCESS = 'FETCH_CREATED_COUNT_SUCCESS';

export const SET_TYPE_AHEAD_VALUE = 'SET_TYPE_AHEAD_VALUE';

export const CHECK_ENGAGEMENT_TYPE = 'CHECK_ENGAGEMENT_TYPE';
export const UNCHECK_ENGAGEMENT_TYPE = 'UNCHECK_ENGAGEMENT_TYPE';

export const CHECK_HELTID_DELTID = 'CHECK_HELTID_DELTID';
export const UNCHECK_HELTID_DELTID = 'UNCHECK_HELTID_DELTID';

export const CHECK_COUNTY = 'CHECK_COUNTY';
export const UNCHECK_COUNTY = 'UNCHECK_COUNTY';
export const CHECK_MUNICIPAL = 'CHECK_MUNICIPAL';
export const UNCHECK_MUNICIPAL = 'UNCHECK_MUNICIPAL';

export const CHECK_SECTOR = 'CHECK_SECTOR';
export const UNCHECK_SECTOR = 'UNCHECK_SECTOR';

export const CHECK_CREATED = 'CHECK_CREATED';
export const UNCHECK_CREATED = 'UNCHECK_CREATED';

/** *********************************************************
 * REDUCER
 ********************************************************* */
const initialState = {
    heltidDeltid: [],
    counties: [],
    engagementType: [],
    sector: [],
    created: [],
    query: {
        q: '',
        counties: [],
        municipals: [],
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
        case FETCH_INITIAL_COUNTIES_SUCCESS:
            return {
                ...state,
                counties: action.response
            };
        case FETCH_COUNTIES_COUNT_SUCCESS:
            return {
                ...state,
                counties: state.counties.map((county) => {
                    const foundCounty = action.response.find((c) => (
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
        case FETCH_INITIAL_CREATED_SUCCESS:
            return {
                ...state,
                created: action.response
            };
        case FETCH_CREATED_COUNT_SUCCESS:
            return {
                ...state,
                created: state.created.map((item) => {
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
        case CHECK_COUNTY:
            return {
                ...state,
                query: {
                    ...state.query,
                    counties: [
                        ...state.query.counties,
                        action.county
                    ],
                    from: 0
                }
            };
        case UNCHECK_COUNTY:
            const countyObject = state.counties.find((c) => c.key === action.county);
            return {
                ...state,
                query: {
                    ...state.query,
                    counties: state.query.counties.filter((c) => (c !== action.county)),
                    municipals: state.query.municipals ? state.query.municipals.filter((m1) =>
                        !countyObject.municipals.find((m) => m.key === m1)) : [],
                    from: 0
                }
            };
        case CHECK_MUNICIPAL:
            return {
                ...state,
                query: {
                    ...state.query,
                    municipals: [
                        ...state.query.municipals,
                        action.municipal
                    ],
                    from: 0
                }
            };
        case UNCHECK_MUNICIPAL:
            return {
                ...state,
                query: {
                    ...state.query,
                    municipals: state.query.municipals.filter((m) => (m !== action.municipal)),
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
        case CHECK_CREATED:
            return {
                ...state,
                query: {
                    ...state.query,
                    created: [
                        ...state.query.created,
                        action.value
                    ],
                    from: 0
                }
            };
        case UNCHECK_CREATED:
            return {
                ...state,
                query: {
                    ...state.query,
                    created: state.query.created.filter((e) => (e !== action.value)),
                    from: 0
                }
            };
        default:
            return state;
    }
}


