"use client";

import { Box, Heading, VStack } from "@navikt/ds-react";
import { PageBlock } from "@navikt/ds-react/Page";
import { useState } from "react";
import type { SavedSearch } from "@/app/stillinger/_common/actions/savedSearchActions";
import AlertModalWithPageReload from "@/app/stillinger/_common/components/modals/AlertModalWithPageReload";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import NoSavedSearches from "@/app/stillinger/lagrede-sok/_components/NoSavedSearches";
import SavedSearchListItem from "./SavedSearchListItem";

interface SavedSearchListProps {
    data: SavedSearch[];
    uuid?: string;
}

/**
 * Displays a list of all saved searches.
 * If browser url contains a parameter ?uuid, for example
 * when clicking a link in a received notification email,
 * this view will auto open the edit modal for the saved search with that uuid
 */
function SavedSearchesList({ data, uuid }: SavedSearchListProps) {
    const [localSavedSearchesList, setLocalSavedSearchesList] = useState(data);
    const [shouldShowErrorModal, openErrorDialog, closeErrorDialog] = useToggle();

    function updateSavedSearchInList(updated: SavedSearch): void {
        setLocalSavedSearchesList(
            localSavedSearchesList.map((old) => (old.id === updated.id ? { ...updated, uuid: old.uuid } : old)),
        );
    }

    function removeSavedSearchFromList(removed: SavedSearch): void {
        setLocalSavedSearchesList(localSavedSearchesList.filter((it) => it.uuid !== removed.uuid));
    }

    if (localSavedSearchesList.length === 0) {
        return <NoSavedSearches />;
    }

    return (
        <>
            <PageBlock width="md" gutters className="mt-5">
                <Heading level="1" size="xlarge" align="center" className="mb-12">
                    Lagrede søk
                </Heading>
            </PageBlock>
            <Box className="bg-brand-peach-subtle" paddingBlock="space-20">
                <PageBlock width="md" gutters>
                    <VStack gap="space-20">
                        {localSavedSearchesList.map((savedSearch) => (
                            <Box background="default" borderRadius="8" padding="space-16" key={savedSearch.uuid}>
                                <SavedSearchListItem
                                    replaceSavedSearchInList={updateSavedSearchInList}
                                    removeSavedSearchFromList={removeSavedSearchFromList}
                                    savedSearch={savedSearch}
                                    autoOpenModal={savedSearch.uuid === uuid}
                                    openErrorDialog={openErrorDialog}
                                />
                            </Box>
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
                </PageBlock>
            </Box>
        </>
    );
}

export default SavedSearchesList;
