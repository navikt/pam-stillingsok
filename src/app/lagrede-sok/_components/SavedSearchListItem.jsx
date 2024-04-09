"use client";

import PropTypes from "prop-types";
import React, { useState, useTransition } from "react";
import { Alert, Link as AkselLink, BodyShort, Heading, Tag, Button, HStack } from "@navikt/ds-react";
import Link from "next/link";
import { ArrowsCirclepathIcon, PencilIcon, TrashIcon } from "@navikt/aksel-icons";
import { formatDate } from "@/app/_common/utils/utils";
import AlertModal from "@/app/_common/components/modals/AlertModal";
import SaveSearchModal from "./modal/SaveSearchModal";
import UserAPI from "@/app/_common/user/UserAPI";
import useToggle from "@/app/_common/hooks/useToggle";
import { FetchStatus } from "@/app/_common/hooks/useFetchReducer";
import { FormModes } from "./modal/SaveSearchForm";
import * as actions from "@/app/_common/actions";

function SavedSearchListItem({
    savedSearch,
    removeSavedSearchFromList,
    replaceSavedSearchInList,
    autoOpenModal,
    openErrorDialog,
}) {
    const [isPending, startTransition] = useTransition();

    const [shouldShowSavedSearchModal, openSavedSearchModal, closeSavedSearchModal] = useToggle(autoOpenModal);
    const [shouldShowConfirmationModal, openConfirmationModal, closeConfirmationModal] = useToggle();
    const [restartEmailNotificationStatus, setRestartEmailNotificationStatus] = useState(FetchStatus.NOT_FETCHED);
    const isEmailNotificationExpired = savedSearch.status === "INACTIVE" && savedSearch.notifyType === "EMAIL";

    function deleteSavedSearch() {
        startTransition(async () => {
            let isSuccess;
            try {
                const { success } = await actions.deleteSavedSearchAction(savedSearch.uuid);
                isSuccess = success;
            } catch (err) {
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

    function reactivateEmailNotification() {
        setRestartEmailNotificationStatus(FetchStatus.IS_FETCHING);

        UserAPI.put(`api/v1/savedsearches/${savedSearch.uuid}`, {
            ...savedSearch,
            status: "ACTIVE",
        })
            .then((response) => {
                setRestartEmailNotificationStatus(FetchStatus.SUCCESS);
                replaceSavedSearchInList(response);
            })
            .catch(() => {
                setRestartEmailNotificationStatus(FetchStatus.FAILURE);
            });
    }

    function handleSavedSearchUpdated(updatedData) {
        replaceSavedSearchInList(updatedData);
    }

    return (
        <article>
            <Heading level="3" size="small" spacing>
                <AkselLink as={Link} href={`/${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}>
                    {savedSearch.title}
                </AkselLink>
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

            <HStack gap="4" className="mt-4">
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
                <Alert variant="error" className="mb-4 mt-4" role="alert">
                    Det oppsto en feil. Klarte ikke starte ny varsling. Forsøk igjen eller last siden på nytt.
                </Alert>
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
                    formData={savedSearch}
                    defaultFormMode={FormModes.UPDATE}
                />
            )}
        </article>
    );
}

SavedSearchListItem.propTypes = {
    savedSearch: PropTypes.shape({
        uuid: PropTypes.string,
        title: PropTypes.string,
        notifyType: PropTypes.string,
        duration: PropTypes.number,
        updated: PropTypes.string,
        searchQuery: PropTypes.string,
        expired: PropTypes.string,
        status: PropTypes.string,
        expires: PropTypes.string,
    }).isRequired,
    removeSavedSearchFromList: PropTypes.func.isRequired,
    replaceSavedSearchInList: PropTypes.func.isRequired,
    autoOpenModal: PropTypes.bool.isRequired,
    openErrorDialog: PropTypes.func.isRequired,
};

export default SavedSearchListItem;
