"use client";

import { ArrowsCirclepathIcon, PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { BodyLong, BodyShort, Button, Heading, HStack, LocalAlert, Tag } from "@navikt/ds-react";
import { useState, useTransition } from "react";
import { AkselNextLink } from "@/app/_common/components/AkselNextLink";
import * as actions from "@/app/stillinger/_common/actions";
import type { SavedSearch } from "@/app/stillinger/_common/actions/savedSearchActions";
import type { ActionResponse } from "@/app/stillinger/_common/actions/types";
import AlertModal from "@/app/stillinger/_common/components/modals/AlertModal";
import { FetchStatus } from "@/app/stillinger/_common/hooks/useFetchReducer";
import useToggle from "@/app/stillinger/_common/hooks/useToggle";
import { formatDate } from "@/app/stillinger/_common/utils/utils";
import { FormModes, type SaveSearchFormData } from "./modal/SaveSearchForm";
import SaveSearchModal from "./modal/SaveSearchModal";

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
    const [deleteError, setDeleteError] = useState(false);
    const isEmailNotificationExpired = savedSearch.status === "INACTIVE" && savedSearch.notifyType === "EMAIL";

    function deleteSavedSearch(): void {
        const { uuid } = savedSearch;
        if (!uuid) {
            setDeleteError(true);
            closeConfirmationModal();
            return;
        }
        startTransition(async () => {
            let isSuccess: boolean | undefined;
            try {
                const { success } = await actions.deleteSavedSearchAction(uuid);
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
        const { uuid } = savedSearch;
        if (!uuid) {
            setRestartEmailNotificationStatus(FetchStatus.FAILURE);
            return;
        }
        setRestartEmailNotificationStatus(FetchStatus.IS_FETCHING);

        let isSuccess: boolean | undefined;
        let result: ActionResponse<SavedSearch> | undefined;
        try {
            const updatedSavedSearch = {
                ...savedSearch,
                status: "ACTIVE",
            };
            result = await actions.restartSavedSearchAction(uuid, updatedSavedSearch);
            isSuccess = result.success;
        } catch {
            isSuccess = false;
        }

        if (isSuccess && result?.data) {
            setRestartEmailNotificationStatus(FetchStatus.SUCCESS);
            replaceSavedSearchInList(result.data);
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
                    data-color="neutral"
                    href={`/stillinger/${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}
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
                <Button
                    variant="secondary-neutral"
                    size="small"
                    onClick={openSavedSearchModal}
                    icon={<PencilIcon aria-hidden="true" />}
                >
                    Endre
                </Button>
                <Button
                    variant="tertiary-neutral"
                    size="small"
                    icon={<TrashIcon aria-hidden="true" />}
                    onClick={openConfirmationModal}
                >
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

            {deleteError && (
                <LocalAlert status="error" className="mb-4 mt-4">
                    <LocalAlert.Header>
                        <LocalAlert.Title>Klarte ikke slette lagret søk.</LocalAlert.Title>
                    </LocalAlert.Header>
                    <LocalAlert.Content>
                        Det oppsto en feil ved sletting av lagret søk. Forsøk igjen eller last siden på nytt.
                    </LocalAlert.Content>
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
