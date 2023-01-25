import { useReducer } from "react";

export const FetchStatus = {
    NOT_FETCHED: "NOT_FETCHED",
    IS_FETCHING: "IS_FETCHING",
    SUCCESS: "SUCCESS",
    FAILURE: "FAILURE"
};

export const FetchAction = {
    BEGIN: "BEGIN",
    RESOLVE: "RESOLVE",
    REJECT: "REJECT",
    SET_DATA: "SET_DATA"
};

export function useFetchReducer(initialData) {
    const initialState = {
        status: FetchStatus.NOT_FETCHED,
        data: initialData,
        error: undefined
    };

    function fetchReducer(currentState, action) {
        switch (action.type) {
            case FetchAction.BEGIN:
                return {
                    ...currentState,
                    status: FetchStatus.IS_FETCHING
                };
            case FetchAction.RESOLVE:
                return {
                    status: FetchStatus.SUCCESS,
                    data: action.data,
                    error: undefined
                };
            case FetchAction.REJECT:
                return {
                    status: FetchStatus.FAILURE,
                    data: undefined,
                    error: action.error
                };
            case FetchAction.SET_DATA:
                return {
                    ...currentState,
                    status: FetchStatus.SUCCESS,
                    data: typeof action.data === "function" ? action.data(currentState.data) : action.data,
                    error: undefined
                };
            default:
                return currentState;
        }
    }

    return useReducer(fetchReducer, initialState);
}
