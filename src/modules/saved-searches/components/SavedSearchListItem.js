import PropTypes from "prop-types";
import React, { useState } from "react";
import { captureException } from "@sentry/browser";
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
import Tag from "../../../common/components/tag/Tag";
import Alert from "../../../common/components/alert/Alert";
import { FormModes } from "./modal/SaveSearchForm";
import AlertModalWithPageReload from "../../../common/components/modals/AlertModalWithPageReload";

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
            .catch((err) => {
                captureException(err);
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
            .catch((err) => {
                captureException(err);
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
            <h3 className="SavedSearchListItem__title">
                <a className="link" href={`${CONTEXT_PATH}${savedSearch.searchQuery}&saved=${savedSearch.uuid}`}>
                    {savedSearch.title}
                </a>
            </h3>

            {isValidISOString(savedSearch.updated) && (
                <p className="SavedSearchListItem__created">
                    Sist endret: {formatDate(savedSearch.updated, "DD.MM.YYYY")}
                </p>
            )}

            {savedSearch.notifyType === "EMAIL" ? (
                <React.Fragment>
                    <p>Varighet på varsel: {savedSearch.duration} dager</p>
                    {isValidISOString(savedSearch.expires) && (
                        <p>Utløper: {formatDate(savedSearch.expires, "DD.MM.YYYY")}</p>
                    )}
                </React.Fragment>
            ) : (
                <p>Ingen varsling</p>
            )}

            <div className="SavedSearchListItem__bottom">
                <EditButton onClick={openSavedSearchModal} />
                <DeleteButton onClick={openConfirmationModal} />
            </div>

            {isEmailNotificationExpired && (
                <Tag className="SavedSearchListItem__expired">
                    Ditt varsel for dette søket har gått ut
                    <RefreshButton
                        onClick={reactivateEmailNotification}
                        disabled={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
                        spinner={restartEmailNotificationStatus === FetchStatus.IS_FETCHING}
                        text="Start ny varsling"
                    />
                </Tag>
            )}

            {restartEmailNotificationStatus === FetchStatus.SUCCESS && (
                <Tag>
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
