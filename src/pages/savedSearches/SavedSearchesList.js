import React, { useEffect } from "react";
import SavedSearchListItem from "./SavedSearchListItem";
import DelayedSpinner from "../../components/spinner/DelayedSpinner";
import ErrorMessage from "../../components/messages/ErrorMessage";
import EmptyMessage from "../../components/messages/EmptyMessage";
import { adUserApiGet } from "../../api/adUserApi";
import LocationSearchParser from "../../utils/LocationSearchParser";
import {FetchAction, FetchStatus, useFetchReducer} from "../../hooks/useFetchReducer";

function SavedSearchesList() {
    const [response, dispatch] = useFetchReducer();
    const idFromBrowserUrl = LocationSearchParser.extractParam("uuid");

    /**
     * Load saved searches when view is shown
     */
    useEffect(() => {
        fetchSavedSearches();
    }, []);

    function fetchSavedSearches() {
        dispatch({ type: FetchAction.BEGIN });

        adUserApiGet("api/v1/savedsearches?size=999&sort=updated,desc")
            .then((response) => {
                dispatch({ type: FetchAction.RESOLVE, data: response.content ? response.content : [] });
            })
            .catch((error) => {
                if (error.statusCode === 404) {
                    dispatch({ type: FetchAction.RESOLVE, data: [] });
                } else {
                    dispatch({ type: FetchAction.REJECT, error });
                }
            });
    }

    /**
     * If user updates a saved search, update it in the local data,
     * instead of re-loading all saved searches from backend
     */
    function replaceSavedSearchInList(updated) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.map((old) => (updated.uuid === old.uuid ? updated : old))
        });
    }

    /**
     * If user deleted a saved search, remove it from the local data,
     * instead of re-loading all saved searches from backend
     */
    function removeSavedSearchFromList(removed) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.filter((it) => it.uuid !== removed.uuid)
        });
    }

    if (response.status === FetchStatus.NOT_FETCHED || response.status === FetchStatus.IS_FETCHING) {
        return <DelayedSpinner />;
    } else if (response.status === FetchStatus.FAILURE && response.error.statusCode !== 404) {
        return <ErrorMessage />;
    } else if (response.status === FetchStatus.SUCCESS && response.data.length === 0) {
        return (
            <EmptyMessage
                title="Du har ingen lagrede søk"
                text="For å lagre et søk må du fylle inn søkeord eller andre kriterier.
                Du kan deretter lagre søket og motta e-postvarsler med nye treff."
            />
        );
    }

    return (
        <section className="SavedSearches__content">
            <h2 className="SavedSearches__h2">
                {response.data.length !== 1 ? `${response.data.length} lagrede søk` : "1 lagret søk"}
            </h2>
            {response.data.map((savedSearch) => (
                <SavedSearchListItem
                    key={savedSearch.uuid}
                    replaceSavedSearchInList={replaceSavedSearchInList}
                    removeSavedSearchFromList={removeSavedSearchFromList}
                    savedSearch={savedSearch}
                    autoOpenModal={savedSearch.uuid === idFromBrowserUrl}
                />
            ))}
        </section>
    );
}

export default SavedSearchesList;
