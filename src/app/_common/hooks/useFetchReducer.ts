import { useReducer } from "react";

export enum FetchStatus {
    NOT_FETCHED = "NOT_FETCHED",
    IS_FETCHING = "IS_FETCHING",
    SUCCESS = "SUCCESS",
    FAILURE = "FAILURE",
}

export enum FetchAction {
    BEGIN = "BEGIN",
    RESOLVE = "RESOLVE",
    REJECT = "REJECT",
    SET_DATA = "SET_DATA",
}

type FetchReducerAction =
    | { type: FetchAction.BEGIN }
    | { type: FetchAction.RESOLVE; data: unknown }
    | { type: FetchAction.REJECT; error: Error }
    | { type: FetchAction.SET_DATA; data: unknown | ((currentData: unknown) => unknown) };

export function useFetchReducer(initialData: unknown) {
    const initialState = {
        status: FetchStatus.NOT_FETCHED,
        data: initialData,
        error: undefined as Error | undefined,
    };

    function fetchReducer(currentState: typeof initialState, action: FetchReducerAction) {
        switch (action.type) {
            case FetchAction.BEGIN:
                return {
                    ...currentState,
                    status: FetchStatus.IS_FETCHING,
                };
            case FetchAction.RESOLVE:
                return {
                    status: FetchStatus.SUCCESS,
                    data: action.data,
                    error: undefined,
                };
            case FetchAction.REJECT:
                return {
                    status: FetchStatus.FAILURE,
                    data: undefined,
                    error: action.error,
                };
            case FetchAction.SET_DATA:
                return {
                    ...currentState,
                    status: FetchStatus.SUCCESS,
                    data: typeof action.data === "function" ? action.data(currentState.data) : action.data,
                    error: undefined,
                };
            default:
                return currentState;
        }
    }

    return useReducer(fetchReducer, initialState);
}
