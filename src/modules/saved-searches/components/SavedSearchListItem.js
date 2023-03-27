import PropTypes from "prop-types";
import React, { useState } from "react";
import { CONTEXT_PATH } from "../../../common/environment";
import { formatDate, isValidISOString } from "../../../common/components/utils";
import AlertModal from "../../../common/components/modals/AlertModal";
import SaveSearchModal from "./modal/SaveSearchModal";
import UserAPI from "../../../common/api/UserAPI";
import useToggle from "../../../common/hooks/useToggle";
import { FetchStatus } from "../../../common/hooks/useFetchReducer";
import DeleteButton from "../../../common/components/buttons/DeleteButton";
import EditButton from "../../../common/components/buttons/EditButton";
import RefreshButton from "../../../common/components/buttons/RefreshButton";
import Alert from "../../../common/components/alert/Alert";
import { FormModes } from "./modal/SaveSearchForm";
import AlertModalWithPageReload from "../../../common/components/modals/AlertModalWithPageReload";
import { BodyLong, BodyShort, Heading, Tag } from "@navikt/ds-react";

function SavedSearchListItem({ savedSearch, removeSavedSearchFromList, replaceSavedSearchInList, autoOpenModal }) {
    const [deleteStatus, setDeleteStatus] = useState(FetchStatus.NOT_FETCHED);
    const [shouldShowSavedSearchModal, openSavedSearchModal, closeSavedSearchModal] = useToggle(autoOpenModal);
    const [shouldShowConfirmationModal, openConfirmationModal, closeConfirmationModal] = useToggle();
    const [shouldShowErrorModal, openErrorModal, closeErrorModal] = useToggle();
    const [restartEmailNotificationStatus, setRestartEmailNotificationStatus] = useState(FetchStatus.NOT_FETCHED);
    const isEmailNotificationExpired = savedSearch.status === "INACTIVE" && savedSearch.notifyType === "EMAIL";

    function deleteSavedSearch() {
        setDeleteStatus(FetchStatus.IS_FETCHING);
        UserAPI.remove(`api/v1/savedsearches/${savedSearch.uuid}`)
            .then(() => {
                closeConfirmationModal();
                setDeleteStatus(FetchStatus.SUCCESS);
                removeSavedSearchFromList(savedSearch);
            })
            .catch(() => {
                setDeleteStatus(FetchStatus.FAILURE);
                closeConfirmationModal();
                openErrorModal();
            });
    }

    function reactivateEmailNotification() {
        setRestartEmailNotificationStatus(FetchStatus.IS_FETCHING);

        UserAPI.put(`api/v1/savedsearches/${savedSearch.uuid}`, {
            ...savedSearch,
            status: "ACTIVE"
        })
            .then((response) => {
                setRestartEmailNotificationStatus(FetchStatus.SUCCESS);
                replaceSavedSearchInList(response);
            })
            .catch(() => {
                setRestartEmailNotificationStatus(FetchStatus.FAILURE);
            });
    }

    function handleConfirmationModalClose() {
        closeConfirmationModal();
        setDeleteStatus(FetchStatus.NOT_FETCHED);
    }

    function handleSavedSearchUpdated(updatedData) {
        replaceSavedSearchInList(updatedData);
    }

    return (
        <article className="SavedSearchListItem">
            <Heading level="3" size="small" className="SavedSearchListItem__title">
                <a href={`${CONTEXT_PATH}${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}>{savedSearch.title}</a>
            </Heading>

            {isValidISOString(savedSearch.updated) && (
                <BodyLong className="SavedSearchListItem__created">
                    Sist endret: {formatDate(savedSearch.updated, "DD.MM.YYYY")}
                </BodyLong>
            )}

            {savedSearch.notifyType === "EMAIL" ? (
                <React.Fragment>
                    <BodyShort>Varighet på varsel: {savedSearch.duration} dager</BodyShort>
                    {isValidISOString(savedSearch.expires) && (
                        <BodyShort>Utløper: {formatDate(savedSearch.expires, "DD.MM.YYYY")}</BodyShort>
                    )}
                </React.Fragment>
            ) : (
                <BodyShort>Ingen varsling</BodyShort>
            )}

            <div className="SavedSearchListItem__bottom">
                <EditButton onClick={openSavedSearchModal} />
                <DeleteButton onClick={openConfirmationModal} />
            </div>

            {isEmailNotificationExpired && (
                <React.Fragment>
                    <div>
                        <Tag variant="warning-filled" className="mt-0_5 mb-0_5">
                            Ditt varsel for dette søket har gått ut
                        </Tag>
                    </div>

                    <RefreshButton
                        onClick={reactivateEmailNotification}
                        disabled={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
                        loading={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
                        text="Start ny varsling"
                    />
                </React.Fragment>
            )}

            {restartEmailNotificationStatus === FetchStatus.SUCCESS && (
                <Tag variant="success-filled">
                    <div role="status">Ny varsling startet</div>
                </Tag>
            )}

            {restartEmailNotificationStatus === FetchStatus.FAILURE && (
                <Alert>
                    Det oppsto en feil. Klarte ikke starte ny varsling. Forsøk igjen eller last siden på nytt.
                </Alert>
            )}

            {shouldShowConfirmationModal && (
                <AlertModal
                    id="confirm-delete-saved-search"
                    onCancel={handleConfirmationModalClose}
                    onConfirm={deleteSavedSearch}
                    confirmLabel="Slett"
                    title="Slette lagret søk"
                    spinner={deleteStatus === FetchStatus.IS_FETCHING}
                >
                    {`Sikker på at du vil slette søket "${savedSearch.title}"?`}
                </AlertModal>
            )}

            {shouldShowErrorModal && (
                <AlertModalWithPageReload
                    id="delete-saved-search-error"
                    onClose={closeErrorModal}
                    title="Feil ved sletting"
                >
                    Forsøk å laste siden på nytt eller prøv igjen om en liten stund.
                </AlertModalWithPageReload>
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
        expired: PropTypes.string
    }).isRequired
};

export default SavedSearchListItem;
