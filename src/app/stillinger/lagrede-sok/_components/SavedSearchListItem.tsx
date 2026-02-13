"use client";

import React, { useState, useTransition } from "react";
import { BodyShort, Heading, Tag, Button, HStack, LocalAlert, BodyLong } from "@navikt/ds-react";
import { ArrowsCirclepathIcon, PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import AlertModal from "@/app/stillinger/_common/components/modals/AlertModal";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import { FetchStatus } from "@/app/stillinger/_common/hooks/useFetchReducer";
import * as actions from "@/app/stillinger/_common/actions";
import { SavedSearch } from "@/app/stillinger/_common/actions/savedSearchActions";
import { ActionResponse } from "@/app/stillinger/_common/actions/types";
import { FormModes, SaveSearchFormData } from "./modal/SaveSearchForm";
import SaveSearchModal from "./modal/SaveSearchModal";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";

interface SavedSearchListItemProps {
    savedSearch: SavedSearch;
    removeSavedSearchFromList: (savedSearch: SavedSearch) => void;
    replaceSavedSearchInList: (updatedData: SavedSearch) => void;
    autoOpenModal: boolean;
    openErrorDialog: () => void;
}

function SavedSearchListItem({
    savedSearch,
    removeSavedSearchFromList,
    replaceSavedSearchInList,
    autoOpenModal,
    openErrorDialog,
}: SavedSearchListItemProps) {
    const [isPending, startTransition] = useTransition();

    const [shouldShowSavedSearchModal, openSavedSearchModal, closeSavedSearchModal] = useToggle(autoOpenModal);
    const [shouldShowConfirmationModal, openConfirmationModal, closeConfirmationModal] = useToggle();
    const [restartEmailNotificationStatus, setRestartEmailNotificationStatus] = useState(FetchStatus.NOT_FETCHED);
    const isEmailNotificationExpired = savedSearch.status === "INACTIVE" && savedSearch.notifyType === "EMAIL";

    function deleteSavedSearch(): void {
        startTransition(async () => {
            let isSuccess;
            try {
                const { success } = await actions.deleteSavedSearchAction(savedSearch!.uuid!);
                isSuccess = success;
            } catch {
                isSuccess = false;
            }
            closeConfirmationModal();
            if (isSuccess) {
                removeSavedSearchFromList(savedSearch);
            } else {
                openErrorDialog();
            }
        });
    }

    async function reactivateEmailNotification(): Promise<void> {
        setRestartEmailNotificationStatus(FetchStatus.IS_FETCHING);

        let isSuccess: boolean;
        let result: ActionResponse<SavedSearch>;
        try {
            const updatedSavedSearch = {
                ...savedSearch,
                status: "ACTIVE",
            };
            result = await actions.restartSavedSearchAction(savedSearch!.uuid!, updatedSavedSearch);
            isSuccess = result.success;
        } catch {
            isSuccess = false;
        }

        if (isSuccess) {
            setRestartEmailNotificationStatus(FetchStatus.SUCCESS);
            replaceSavedSearchInList(result!.data!);
        } else {
            setRestartEmailNotificationStatus(FetchStatus.FAILURE);
        }
    }

    function handleSavedSearchUpdated(updatedData: SavedSearch): void {
        replaceSavedSearchInList(updatedData);
    }

    return (
        <article>
            <Heading level="2" size="small" spacing>
                <AkselNextLink
                    href={`/stillinger/${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}
                    prefetch={false}
                >
                    {savedSearch.title}
                </AkselNextLink>
            </Heading>

            {savedSearch.updated && <BodyShort spacing>Sist endret: {formatDate(savedSearch.updated)}</BodyShort>}

            {savedSearch.notifyType === "EMAIL" ? (
                <>
                    <BodyShort>Varighet på varsel: {savedSearch.duration} dager</BodyShort>
                    {savedSearch.expires && <BodyShort>Utløper: {formatDate(savedSearch.expires)}</BodyShort>}
                </>
            ) : (
                <BodyShort>Ingen varsling</BodyShort>
            )}

            {isEmailNotificationExpired && (
                <Tag variant="warning-moderate" className="mt-2 mb-2">
                    Ditt varsel for dette søket har gått ut
                </Tag>
            )}

            {restartEmailNotificationStatus === FetchStatus.SUCCESS && (
                <Tag variant="success-moderate" className="mt-2 mb-2">
                    <div role="status">Ny varsling startet</div>
                </Tag>
            )}

            <HStack gap="space-16" className="mt-4">
                <Button variant="tertiary" onClick={openSavedSearchModal} icon={<PencilIcon aria-hidden="true" />}>
                    Endre
                </Button>
                <Button variant="tertiary" icon={<TrashIcon aria-hidden="true" />} onClick={openConfirmationModal}>
                    Slett
                </Button>
                {isEmailNotificationExpired && (
                    <Button
                        variant="tertiary"
                        onClick={reactivateEmailNotification}
                        disabled={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
                        loading={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
                        icon={<ArrowsCirclepathIcon aria-hidden="true" />}
                    >
                        Start ny varsling
                    </Button>
                )}
            </HStack>

            {restartEmailNotificationStatus === FetchStatus.FAILURE && (
                <LocalAlert status="error" className="mb-4 mt-4" role="alert">
                    <LocalAlert.Header className="padding-0-75">
                        <LocalAlert.Title>
                            <BodyLong>
                                Det oppsto en feil. Klarte ikke starte ny varsling. Forsøk igjen eller last siden på
                                nytt.
                            </BodyLong>
                        </LocalAlert.Title>
                    </LocalAlert.Header>
                </LocalAlert>
            )}

            {shouldShowConfirmationModal && (
                <AlertModal
                    id="confirm-delete-saved-search"
                    onCancel={() => closeConfirmationModal()}
                    onConfirm={deleteSavedSearch}
                    confirmLabel="Slett"
                    title="Slette lagret søk"
                    spinner={isPending}
                >
                    {`Sikker på at du vil slette søket "${savedSearch.title}"?`}
                </AlertModal>
            )}

            {shouldShowSavedSearchModal && (
                <SaveSearchModal
                    onSaveSearchSuccess={handleSavedSearchUpdated}
                    onClose={closeSavedSearchModal}
                    savedSearchUuid={savedSearch.uuid}
                    formData={savedSearch as SaveSearchFormData}
                    defaultFormMode={FormModes.UPDATE}
                />
            )}
        </article>
    );
}

export default SavedSearchListItem;
