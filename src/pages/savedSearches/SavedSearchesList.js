import React, {useEffect} from "react";
import {captureException} from "@sentry/browser";
import SavedSearchListItem from "./SavedSearchListItem";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import ErrorMessage from "../../components/messages/ErrorMessage";
import UserAPI from "../../api/UserAPI";
import {FetchAction, FetchStatus, useFetchReducer} from "../../hooks/useFetchReducer";
import {extractParam} from "../../components/utils";
import SavedSearchesIsEmpty from "./SavedSearchesIsEmpty";

/**
 * Displays a list of all saved searches.
 * If browser url contains a parameter ?uuid, for example
 * when clicking a link in a received notification email,
 * this view will auto open the edit modal for the saved search with that uuid
 */
function SavedSearchesList() {
    const [{ status, data }, dispatch] = useFetchReducer();
    const uuidFromBrowserUrl = extractParam("uuid");

    /**
     * Load saved searches when list is shown
     */
    useEffect(() => {
        fetchSavedSearches();
    }, []);

    function fetchSavedSearches() {
        dispatch({ type: FetchAction.BEGIN });

        UserAPI.get("api/v1/savedsearches?size=999&sort=updated,desc")
            .then((response) => {
                dispatch({ type: FetchAction.RESOLVE, data: response.content ? response.content : [] });
            })
            .catch((error) => {
                captureException(error);
                dispatch({ type: FetchAction.REJECT, error });
            });
    }

    /**
     * After user updated a saved search, update it in the already loaded data,
     * instead of re-loading all saved searches from backend
     */
    function updateSavedSearchInList(updated) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.map((old) => (updated.uuid === old.uuid ? updated : old))
        });
    }

    /**
     * If user deleted a saved search, remove it from already loaded data,
     * instead of re-loading all saved searches from backend
     */
    function removeSavedSearchFromList(removed) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.filter((it) => it.uuid !== removed.uuid)
        });
    }

    return (
        <React.Fragment>
            {(status === FetchStatus.NOT_FETCHED || status === FetchStatus.IS_FETCHING) && <DelayedSpinner />}
            {status === FetchStatus.FAILURE && <ErrorMessage />}
            {status === FetchStatus.SUCCESS && data.length === 0 && <SavedSearchesIsEmpty />}
            {status === FetchStatus.SUCCESS && data.length > 0 && (
                <section className="SavedSearches__content">
                    <h2 className="SavedSearches__h2">
                        {data.length} {data.length === 1 ? "lagret" : "lagrede"} søk
                    </h2>
                    {data.map((savedSearch) => (
                        <SavedSearchListItem
                            key={savedSearch.uuid}
                            replaceSavedSearchInList={updateSavedSearchInList}
                            removeSavedSearchFromList={removeSavedSearchFromList}
                            savedSearch={savedSearch}
                            autoOpenModal={savedSearch.uuid === uuidFromBrowserUrl}
                        />
                    ))}
                </section>
            )}
        </React.Fragment>
    );
}

export default SavedSearchesList;
