"use client";

import React from "react";
import { Heading } from "@navikt/ds-react";
import PropTypes from "prop-types";
import SavedSearchListItem from "./SavedSearchListItem";
import { FetchAction } from "../../../_common/hooks/useFetchReducer";

/**
 * Displays a list of all saved searches.
 * If browser url contains a parameter ?uuid, for example
 * when clicking a link in a received notification email,
 * this view will auto open the edit modal for the saved search with that uuid
 */
function SavedSearchesList({ data, dispatch, uuid }) {
    /**
     * After user updated a saved search, update it in the already loaded data,
     * instead of re-loading all saved searches from backend
     */
    function updateSavedSearchInList(updated) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.map((old) => (updated.uuid === old.uuid ? updated : old)),
        });
    }

    /**
     * If user deleted a saved search, remove it from already loaded data,
     * instead of re-loading all saved searches from backend
     */
    function removeSavedSearchFromList(removed) {
        dispatch({
            type: FetchAction.SET_DATA,
            data: (prevState) => prevState.filter((it) => it.uuid !== removed.uuid),
        });
    }

    return (
        <section className="container-medium mt-16 mb-16">
            <Heading level="1" size="xlarge" spacing>
                Lagrede søk
            </Heading>
            {data.map((savedSearch) => (
                <SavedSearchListItem
                    key={savedSearch.uuid}
                    replaceSavedSearchInList={updateSavedSearchInList}
                    removeSavedSearchFromList={removeSavedSearchFromList}
                    savedSearch={savedSearch}
                    autoOpenModal={savedSearch.uuid === uuid}
                />
            ))}
        </section>
    );
}

SavedSearchesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    dispatch: PropTypes.func.isRequired,
    uuid: PropTypes.string,
};

export default SavedSearchesList;
