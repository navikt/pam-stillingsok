export interface FetchResult<T> {
    errors?: FetchError[];
    data?: T;
}

export interface FetchError {
    type: string;
}

// These files must be in a separate file other than fetchPostcodes.ts and fetchLocationsWithinDrivingDistance.ts because those files are
// supposed to run on the server, while these values will also be used in client code.
export const FETCH_POSTCODES_ERROR = "FETCH_POSTCODES_ERROR";
export const FETCH_KOMMUNER_ERROR = "FETCH_KOMMUNER_ERROR";
export const FETCH_FYLKER_ERROR = "FETCH_FYLKER_ERROR";
export const FETCH_SEARCH_WITHIN_DISTANCE_ERROR = "FETCH_SEARCH_WITHIN_DISTANCE_ERROR";
