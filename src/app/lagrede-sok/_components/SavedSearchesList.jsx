"use client";

import React, { useState } from "react";
import { Heading, VStack } from "@navikt/ds-react";
import PropTypes from "prop-types";
import SavedSearchListItem from "./SavedSearchListItem";
import NoFavourites from "@/app/favoritter/_components/NoFavourites";
import AlertModalWithPageReload from "@/app/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/_common/hooks/useToggle";

/**
 * Displays a list of all saved searches.
 * If browser url contains a parameter ?uuid, for example
 * when clicking a link in a received notification email,
 * this view will auto open the edit modal for the saved search with that uuid
 */
function SavedSearchesList({ data, uuid }) {
    const [localSavedSearchesList, setLocalSavedSearchesList] = useState(data);
    const [shouldShowErrorModal, openErrorDialog, closeErrorDialog] = useToggle();

    function updateSavedSearchInList(updated) {
        setLocalSavedSearchesList(
            localSavedSearchesList.map((old) => (old.id === updated.id ? { ...updated, uuid: old.uuid } : old)),
        );
    }

    function removeSavedSearchFromList(removed) {
        setLocalSavedSearchesList(localSavedSearchesList.filter((it) => it.uuid !== removed.uuid));
    }

    if (localSavedSearchesList.length === 0) {
        return <NoFavourites />;
    }

    return (
        <section className="container-medium mt-16 mb-16">
            <Heading level="1" size="xlarge" className="mb-12">
                Lagrede søk
            </Heading>
            <VStack gap="10">
                {localSavedSearchesList.map((savedSearch) => (
                    <SavedSearchListItem
                        key={savedSearch.uuid}
                        replaceSavedSearchInList={updateSavedSearchInList}
                        removeSavedSearchFromList={removeSavedSearchFromList}
                        savedSearch={savedSearch}
                        autoOpenModal={savedSearch.uuid === uuid}
                        openErrorDialog={openErrorDialog}
                    />
                ))}
            </VStack>
            {shouldShowErrorModal && (
                <AlertModalWithPageReload
                    id="delete-saved-search-error"
                    onClose={closeErrorDialog}
                    title="Feil ved sletting"
                >
                    Forsøk å laste siden på nytt eller prøv igjen om en liten stund.
                </AlertModalWithPageReload>
            )}
        </section>
    );
}

SavedSearchesList.propTypes = {
    data: PropTypes.arrayOf(PropTypes.shape({})).isRequired,
    uuid: PropTypes.string,
};

export default SavedSearchesList;
